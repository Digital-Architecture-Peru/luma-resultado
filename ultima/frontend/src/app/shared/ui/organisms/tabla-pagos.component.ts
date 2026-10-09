import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Pago } from '../../../features/pagos/models/pago.model';
import { FilaPagoComponent } from '../molecules/fila-pago.component';

/** Organismo: tabla de pagos con estado vacío. */
@Component({
  selector: 'app-tabla-pagos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FilaPagoComponent],
  template: `
    @if (pagos.length === 0) {
      <p class="vacio" role="status">No se encontraron pagos para los filtros indicados.</p>
    } @else {
      <table>
        <caption class="sr-only">Historial de pagos</caption>
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Beneficiario</th>
            <th scope="col">Cuenta origen</th>
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
    }
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; background: var(--surface); }
    th, :host ::ng-deep td { padding: var(--space-3); border-bottom: 1px solid var(--border); text-align: start; }
    th.num { text-align: end; }
    .vacio { color: var(--muted); padding: var(--space-4); }
    .sr-only { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  `],
})
export class TablaPagosComponent {
  @Input({ required: true }) pagos: readonly Pago[] = [];
}
