import { ChangeDetectionStrategy, Component, Input, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountsApi } from '../data/accounts.api';
import { Cuenta } from '../data/account.model';
import { LayoutConsultaComponent } from '../templates/layout-consulta.template';
import { DetalleCuentaComponent } from '../organisms/detalle-cuenta.organism';

type Estado = { tipo: 'cargando' } | { tipo: 'noEncontrada' } | { tipo: 'error' } | { tipo: 'ok'; cuenta: Cuenta };

@Component({
  selector: 'app-cuenta-detalle-page',
  standalone: true,
  imports: [LayoutConsultaComponent, DetalleCuentaComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-layout-consulta titulo="Detalle de cuenta">
      <p><a routerLink="/">← Volver a mis cuentas</a></p>
      @switch (estado().tipo) {
        @case ('cargando') { <p role="status">Cargando…</p> }
        @case ('noEncontrada') { <p role="alert">La cuenta no existe o no está disponible.</p> }
        @case ('error') { <p role="alert">No pudimos cargar la cuenta.</p> }
        @default {
          @if (cuenta(); as c) { <app-detalle-cuenta [cuenta]="c" /> }
        }
      }
    </app-layout-consulta>
  `
})
export class CuentaDetallePageComponent implements OnInit {
  private readonly api = inject(AccountsApi);

  @Input() id = '';
  readonly estado = signal<Estado>({ tipo: 'cargando' });

  ngOnInit(): void {
    this.api.obtener(this.id).subscribe({
      next: (cuenta) => this.estado.set({ tipo: 'ok', cuenta }),
      error: (e: HttpErrorResponse) => this.estado.set({ tipo: e.status === 404 ? 'noEncontrada' : 'error' })
    });
  }

  cuenta(): Cuenta | null {
    const e = this.estado();
    return e.tipo === 'ok' ? e.cuenta : null;
  }
}
