import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CuentaEnmascaradaComponent } from '../atoms/cuenta-enmascarada.component';
import { EstadoBadgeComponent } from '../atoms/estado-badge.component';
import { MontoComponent } from '../atoms/monto.component';
import { Pago } from '../data/pago.model';

/** Molecula: una fila de la tabla, compuesta por atomos. Fechas UTC formateadas en el cliente. */
@Component({
  selector: 'tr[app-fila-pago]',
  standalone: true,
  imports: [DatePipe, CuentaEnmascaradaComponent, EstadoBadgeComponent, MontoComponent],
  template: `
    <td>{{ pago.fechaPago | date: 'medium' }}</td>
    <td>{{ pago.beneficiario }}</td>
    <td>{{ pago.concepto }}</td>
    <td><app-cuenta-enmascarada [valor]="pago.cuentaEnmascarada" /></td>
    <td class="num"><app-monto [valor]="pago.monto" [moneda]="pago.moneda" /></td>
    <td><app-estado-badge [estado]="pago.estado" /></td>
    <td><button type="button" (click)="seleccionar.emit(pago)">Ver detalle</button></td>
  `,
})
export class FilaPagoComponent {
  @Input({ required: true }) pago!: Pago;
  @Output() seleccionar = new EventEmitter<Pago>();
}
