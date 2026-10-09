import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ESTADOS_PAGO, EstadoPago, FiltroPagos } from '../../core/pago.model';
import { FiltroFechasComponent, RangoFechas } from '../../molecules/filtro-fechas/filtro-fechas.component';

/** Organismo: formulario de filtros (fechas + estado). Emite el filtro al pulsar «Consultar». */
@Component({
  selector: 'app-panel-filtros',
  standalone: true,
  imports: [FiltroFechasComponent],
  template: `
    <form class="panel" (submit)="consultar($event)">
      <app-filtro-fechas [desde]="desde" [hasta]="hasta" (rangoCambio)="actualizarRango($event)" />
      <label>
        Estado
        <select [value]="estado" (change)="cambiarEstado($event)">
          <option value="">Todos</option>
          @for (e of estados; track e) {
            <option [value]="e">{{ e }}</option>
          }
        </select>
      </label>
      <button type="submit" class="primary" [disabled]="cargando">Consultar</button>
    </form>
  `,
  styles: [
    `
      .panel { display: flex; flex-wrap: wrap; gap: 1rem; align-items: end; background: var(--surface); padding: 1rem; border: 1px solid var(--border); border-radius: var(--radius-md); }
      label { display: grid; gap: 0.25rem; font-size: 0.875rem; color: var(--muted); }
    `,
  ],
})
export class PanelFiltrosComponent {
  @Input() cargando = false;
  @Output() consultaSolicitada = new EventEmitter<Omit<FiltroPagos, 'page' | 'size'>>();

  readonly estados = ESTADOS_PAGO;
  desde = '';
  hasta = '';
  estado: EstadoPago | '' = '';

  actualizarRango(rango: RangoFechas): void {
    this.desde = rango.desde;
    this.hasta = rango.hasta;
  }

  cambiarEstado(evento: Event): void {
    this.estado = (evento.target as HTMLSelectElement).value as EstadoPago | '';
  }

  consultar(evento: Event): void {
    evento.preventDefault();
    this.consultaSolicitada.emit({ desde: this.desde, hasta: this.hasta, estado: this.estado });
  }
}
