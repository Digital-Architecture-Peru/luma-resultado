import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pago, Pagina } from '../data/pago.model';
import { PagosApiService } from '../data/pagos-api.service';
import { CriteriosFiltro, FiltroFechasComponent } from '../molecules/filtro-fechas.component';
import { DetallePagoComponent } from '../organisms/detalle-pago.component';
import { TablaPagosComponent } from '../organisms/tabla-pagos.component';
import { ConsultaLayoutComponent } from '../templates/consulta-layout.component';

type Carga = 'idle' | 'loading' | 'success' | 'error';

const TAMANO_PAGINA = 10;
// Cuenta ficticia provisional hasta que el gateway/BFF entregue la identidad (H3).
const CUENTA_DEMO = '0012345678901234';

/** Pagina: orquesta filtros, carga remota y seleccion de detalle. */
@Component({
  selector: 'app-consulta-pagos-page',
  standalone: true,
  imports: [FormsModule, ConsultaLayoutComponent, FiltroFechasComponent, TablaPagosComponent, DetallePagoComponent],
  template: `
    <app-consulta-layout>
      <div filtros>
        <label>Cuenta (provisional) <input name="cuenta" [ngModel]="cuentaId()" (ngModelChange)="cuentaId.set($event)" /></label>
        <app-filtro-fechas (buscar)="aplicar($event)" />
      </div>
      <div contenido>
        @switch (carga()) {
          @case ('loading') { <p role="status">Cargando pagos…</p> }
          @case ('error') { <p role="alert">{{ mensajeError() }}</p> }
          @case ('success') {
            <app-tabla-pagos [pagos]="pagina()?.contenido ?? []" (seleccionar)="seleccionado.set($event)" />
            <nav aria-label="Paginacion">
              <button type="button" (click)="cambiarPagina(-1)" [disabled]="(pagina()?.page ?? 0) === 0">Anterior</button>
              <span role="status">Pagina {{ (pagina()?.page ?? 0) + 1 }} de {{ pagina()?.totalPaginas || 1 }}</span>
              <button type="button" (click)="cambiarPagina(1)" [disabled]="!haySiguiente()">Siguiente</button>
            </nav>
          }
          @default { <p>Indica los criterios y pulsa Consultar.</p> }
        }
      </div>
      <div detalle>
        @if (seleccionado(); as pago) {
          <app-detalle-pago [pago]="pago" (cerrar)="seleccionado.set(null)" />
        }
      </div>
    </app-consulta-layout>
  `,
})
export class ConsultaPagosPage {
  private readonly api = inject(PagosApiService);

  readonly cuentaId = signal(CUENTA_DEMO);
  readonly carga = signal<Carga>('idle');
  readonly pagina = signal<Pagina<Pago> | null>(null);
  readonly seleccionado = signal<Pago | null>(null);
  readonly mensajeError = signal('');

  private criterios: CriteriosFiltro = { desde: '', hasta: '', estado: '' };
  private paginaActual = 0;

  aplicar(criterios: CriteriosFiltro): void {
    this.criterios = criterios;
    this.paginaActual = 0;
    this.cargar();
  }

  cambiarPagina(delta: number): void {
    this.paginaActual = Math.max(0, this.paginaActual + delta);
    this.cargar();
  }

  haySiguiente(): boolean {
    const p = this.pagina();
    return !!p && p.page + 1 < p.totalPaginas;
  }

  private cargar(): void {
    this.carga.set('loading');
    this.seleccionado.set(null);
    const { desde, hasta, estado } = this.criterios;
    this.api
      .listar({
        cuentaId: this.cuentaId(),
        desde: desde ? `${desde}T00:00:00Z` : undefined,
        hasta: hasta ? `${hasta}T23:59:59Z` : undefined,
        estado,
        page: this.paginaActual,
        size: TAMANO_PAGINA,
      })
      .subscribe({
        next: (pagina) => {
          this.pagina.set(pagina);
          this.carga.set('success');
        },
        error: (err: HttpErrorResponse) => {
          this.mensajeError.set(err.error?.detail ?? 'No se pudo consultar los pagos. Intenta de nuevo.');
          this.carga.set('error');
        },
      });
  }
}
