import { Component, inject } from '@angular/core';
import { PagosApiService } from '../../core/pagos-api.service';
import { FiltroPagos, PaginaPagos } from '../../core/pago.model';
import { PanelFiltrosComponent } from '../../organisms/panel-filtros/panel-filtros.component';
import { TablaPagosComponent } from '../../organisms/tabla-pagos/tabla-pagos.component';
import { ConsultaLayoutComponent } from '../../templates/consulta-layout/consulta-layout.component';

type EstadoCarga = 'idle' | 'loading' | 'success' | 'error';

const TAMANO_PAGINA = 20;

/** Página: orquesta filtros, servicio y tabla; modela el estado remoto. */
@Component({
  selector: 'app-consulta-pagos',
  standalone: true,
  imports: [ConsultaLayoutComponent, PanelFiltrosComponent, TablaPagosComponent],
  template: `
    <app-consulta-layout titulo="Consulta de pagos">
      <app-panel-filtros [cargando]="estado === 'loading'" (consultaSolicitada)="buscar($event)" />

      @switch (estado) {
        @case ('loading') {
          <p role="status">Cargando pagos…</p>
        }
        @case ('error') {
          <p role="alert" class="error">{{ mensajeError }}</p>
        }
        @case ('success') {
          <app-tabla-pagos
            [pagos]="pagina.items"
            [page]="pagina.page"
            [size]="pagina.size"
            [total]="pagina.total"
            (paginaCambio)="irAPagina($event)"
          />
        }
        @default {
          <p role="status">Elige filtros y pulsa «Consultar».</p>
        }
      }
    </app-consulta-layout>
  `,
  styles: [`.error { color: var(--danger); font-weight: 600; }`],
})
export class ConsultaPagosPageComponent {
  private readonly api = inject(PagosApiService);

  estado: EstadoCarga = 'idle';
  mensajeError = '';
  pagina: PaginaPagos = { items: [], page: 1, size: TAMANO_PAGINA, total: 0 };
  private filtroActual: Omit<FiltroPagos, 'page' | 'size'> = {};

  buscar(filtro: Omit<FiltroPagos, 'page' | 'size'>): void {
    this.filtroActual = filtro;
    this.cargar(1);
  }

  irAPagina(page: number): void {
    this.cargar(page);
  }

  private cargar(page: number): void {
    this.estado = 'loading';
    this.api.consultar({ ...this.filtroActual, page, size: TAMANO_PAGINA }).subscribe({
      next: (resultado) => {
        this.pagina = resultado;
        this.estado = 'success';
      },
      error: () => {
        this.mensajeError = 'No se pudo consultar los pagos. Revisa los filtros (máximo 90 días) e inténtalo de nuevo.';
        this.estado = 'error';
      },
    });
  }
}
