import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Pago } from '../../../features/pagos/models/pago.model';
import { BadgeEstadoComponent } from '../atoms/badge-estado.component';

/** Molécula: fila de la tabla de pagos (átomo badge + datos formateados). */
@Component({
  selector: 'tr[app-fila-pago]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeEstadoComponent, CurrencyPipe, DatePipe],
  template: `
    <td>{{ pago.fechaPago | date: 'dd/MM/yyyy HH:mm' }}</td>
    <td>{{ pago.beneficiario }}</td>
    <td>{{ pago.cuentaOrigenMask }}</td>
    <td class="num">{{ pago.monto | currency: pago.moneda }}</td>
    <td><app-badge-estado [estado]="pago.estado" /></td>
  `,
  styles: [`.num { text-align: end; font-variant-numeric: tabular-nums; }`],
})
export class FilaPagoComponent {
  @Input({ required: true }) pago!: Pago;
}
