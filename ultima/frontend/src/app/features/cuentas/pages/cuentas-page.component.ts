import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CuentaResumen } from '../../../core/cuenta.model';
import { CuentasApiService } from '../../../core/cuentas-api.service';
import { CuentasLayoutComponent } from '../templates/cuentas-layout.component';
import { ListaCuentasComponent } from '../../../shared/organisms/lista-cuentas.component';

type Estado = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-cuentas-page',
  standalone: true,
  imports: [FormsModule, CuentasLayoutComponent, ListaCuentasComponent],
  template: `
    <app-cuentas-layout>
      <form filtro (ngSubmit)="consultar()">
        <label for="clienteId">Cliente (simulado)</label>
        <input id="clienteId" name="clienteId" [(ngModel)]="clienteId" required maxlength="20" />
        <button type="submit" [disabled]="estado() === 'loading'">Consultar cuentas</button>
      </form>

      @switch (estado()) {
        @case ('loading') { <p role="status">Cargando cuentas...</p> }
        @case ('error') { <p role="alert" class="error">{{ mensajeError() }}</p> }
        @case ('success') { <app-lista-cuentas [cuentas]="cuentas()" /> }
        @default { <p>Ingrese un cliente y consulte sus cuentas.</p> }
      }
    </app-cuentas-layout>
  `,
  styles: [
    `form { display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: center; }
     .error { color: var(--danger); }`,
  ],
})
export class CuentasPageComponent {
  private readonly api = inject(CuentasApiService);

  clienteId = 'CLI-001';
  readonly estado = signal<Estado>('idle');
  readonly cuentas = signal<CuentaResumen[]>([]);
  readonly mensajeError = signal('');

  consultar(): void {
    this.estado.set('loading');
    this.api.listar(this.clienteId.trim()).subscribe({
      next: (cuentas) => {
        this.cuentas.set(cuentas);
        this.estado.set('success');
      },
      error: (e: { status?: number }) => {
        this.mensajeError.set(
          e.status === 400
            ? 'El identificador de cliente no es valido.'
            : 'No fue posible consultar las cuentas. Intente nuevamente.',
        );
        this.estado.set('error');
      },
    });
  }
}
