import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Cuenta } from '../models/cuenta.model';
import { CuentasApiService } from '../services/cuentas-api.service';
import { LayoutConsultaComponent } from '../templates/layout-consulta.component';
import { ListaCuentasComponent } from '../organisms/lista-cuentas.component';
import { DetalleCuentaComponent } from '../organisms/detalle-cuenta.component';

type Estado = 'cargando' | 'listo' | 'error';

/** Page: orquesta la carga de datos y la selección. */
@Component({
  selector: 'app-cuentas-page',
  standalone: true,
  imports: [LayoutConsultaComponent, ListaCuentasComponent, DetalleCuentaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-layout-consulta>
      <div estado role="status" aria-live="polite">
        @if (estado() === 'cargando') { <p>Cargando cuentas…</p> }
        @if (estado() === 'error') {
          <p class="error">No se pudieron cargar las cuentas.
            <button type="button" (click)="cargar()">Reintentar</button></p>
        }
      </div>
      @if (estado() === 'listo') {
        <app-lista-cuentas listado [cuentas]="cuentas()" (seleccionar)="seleccionada.set($event)" />
      }
      @if (seleccionada(); as sel) {
        <app-detalle-cuenta detalle [cuenta]="sel" />
      }
    </app-layout-consulta>
  `,
  styles: [`.error { color: var(--danger); }`]
})
export class CuentasPageComponent implements OnInit {
  private readonly api = inject(CuentasApiService);

  readonly estado = signal<Estado>('cargando');
  readonly cuentas = signal<Cuenta[]>([]);
  readonly seleccionada = signal<Cuenta | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.estado.set('cargando');
    this.api.listar().subscribe({
      next: (pagina) => {
        this.cuentas.set(pagina.contenido);
        this.estado.set('listo');
      },
      error: () => this.estado.set('error')
    });
  }
}
