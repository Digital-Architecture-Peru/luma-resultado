import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pago } from '../../core/pago.model';
import { FilaPagoComponent } from '../../molecules/fila-pago/fila-pago.component';

/** Organismo: tabla de pagos con estado vacío y paginación. */
@Component({
  selector: 'app-tabla-pagos',
  standalone: true,
  imports: [FilaPagoComponent],
  template: `
    @if (pagos.length === 0) {
      <p class="vacio" role="status">No hay pagos para los filtros seleccionados.</p>
    } @else {
      <table>
        <caption class="sr-only">Pagos realizados</caption>
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Referencia</th>
            <th scope="col">Beneficiario</th>
            <th scope="col">Cuenta</th>
            <th scope="col" class="num">Monto</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          @for (pago of pagos; track pago.id) {
            <tr app-fila-pago [pago]="pago"></tr>
          }
        </tbody>
      </table>
      <nav class="paginacion" aria-label="Paginación">
        <button type="button" (click)="cambiarPagina(page - 1)" [disabled]="page <= 1">Anterior</button>
        <span>Página {{ page }} de {{ totalPaginas }} ({{ total }} pagos)</span>
        <button type="button" (click)="cambiarPagina(page + 1)" [disabled]="page >= totalPaginas">Siguiente</button>
      </nav>
    }
  `,
  styles: [
    `
      table { width: 100%; border-collapse: collapse; background: var(--surface); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm); }
      th { text-align: start; padding: 0.5rem 0.75rem; border-bottom: 2px solid var(--border); font-size: 0.85rem; color: var(--muted); }
      .num { text-align: end; }
      .vacio { padding: 1.5rem; text-align: center; color: var(--muted); }
      .paginacion { display: flex; gap: 1rem; align-items: center; justify-content: center; margin-top: 1rem; }
      .sr-only { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); }
    `,
  ],
})
export class TablaPagosComponent {
  @Input() pagos: Pago[] = [];
  @Input() page = 1;
  @Input() size = 20;
  @Input() total = 0;
  @Output() paginaCambio = new EventEmitter<number>();

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.total / this.size));
  }

  cambiarPagina(destino: number): void {
    if (destino < 1 || destino > this.totalPaginas || destino === this.page) return;
    this.paginaCambio.emit(destino);
  }
}
