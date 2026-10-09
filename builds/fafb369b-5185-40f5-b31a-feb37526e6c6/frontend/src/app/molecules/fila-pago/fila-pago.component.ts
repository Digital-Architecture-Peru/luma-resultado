import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Pago } from '../../core/pago.model';
import { EstadoBadgeComponent } from '../../atoms/estado-badge/estado-badge.component';
import { MontoComponent } from '../../atoms/monto/monto.component';

/** Molécula: fila de la tabla de pagos. */
@Component({
  selector: 'tr[app-fila-pago]',
  standalone: true,
  imports: [DatePipe, EstadoBadgeComponent, MontoComponent],
  template: `
    <td>{{ pago.fechaPago | date: 'dd/MM/yyyy HH:mm' }}</td>
    <td>{{ pago.referencia }}</td>
    <td>{{ pago.beneficiario }}</td>
    <td>{{ pago.cuentaEnmascarada }}</td>
    <td class="num"><app-monto [monto]="pago.monto" [moneda]="pago.moneda" /></td>
    <td><app-estado-badge [estado]="pago.estado" /></td>
  `,
  styles: [`:host td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); } .num { text-align: end; }`],
})
export class FilaPagoComponent {
  @Input({ required: true }) pago!: Pago;
}
