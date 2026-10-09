import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pago } from '../data/pago.model';
import { FilaPagoComponent } from '../molecules/fila-pago.component';

/** Organismo: tabla de pagos con estado vacio. */
@Component({
  selector: 'app-tabla-pagos',
  standalone: true,
  imports: [FilaPagoComponent],
  template: `
    @if (pagos.length === 0) {
      <p>No hay pagos para los criterios indicados.</p>
    } @else {
      <table>
        <caption>Pagos</caption>
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Beneficiario</th>
            <th scope="col">Concepto</th>
            <th scope="col">Cuenta</th>
            <th scope="col" class="num">Monto</th>
            <th scope="col">Estado</th>
            <th scope="col"><span class="sr">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          @for (p of pagos; track p.id) {
            <tr app-fila-pago [pago]="p" (seleccionar)="seleccionar.emit($event)"></tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: [
    `table { width: 100%; border-collapse: collapse; background: var(--surface); }
     caption { text-align: start; font-weight: 600; padding-block: var(--space-2); }
     th, td { padding: var(--space-2) var(--space-3); border-bottom: 1px solid var(--border); text-align: start; }
     .num { text-align: end; }
     .sr { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); }`,
  ],
})
export class TablaPagosComponent {
  @Input({ required: true }) pagos: Pago[] = [];
  @Output() seleccionar = new EventEmitter<Pago>();
}
