import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CuentaEnmascaradaComponent } from '../atoms/cuenta-enmascarada.component';
import { EstadoBadgeComponent } from '../atoms/estado-badge.component';
import { MontoComponent } from '../atoms/monto.component';
import { Pago } from '../data/pago.model';

/** Organismo: detalle de un pago seleccionado. */
@Component({
  selector: 'app-detalle-pago',
  standalone: true,
  imports: [DatePipe, CuentaEnmascaradaComponent, EstadoBadgeComponent, MontoComponent],
  template: `
    <section aria-labelledby="detalle-titulo" class="detalle">
      <h2 id="detalle-titulo">Detalle del pago #{{ pago.id }}</h2>
      <dl>
        <dt>Beneficiario</dt><dd>{{ pago.beneficiario }}</dd>
        <dt>Concepto</dt><dd>{{ pago.concepto }}</dd>
        <dt>Cuenta</dt><dd><app-cuenta-enmascarada [valor]="pago.cuentaEnmascarada" /></dd>
        <dt>Monto</dt><dd><app-monto [valor]="pago.monto" [moneda]="pago.moneda" /></dd>
        <dt>Estado</dt><dd><app-estado-badge [estado]="pago.estado" /></dd>
        <dt>Fecha</dt><dd>{{ pago.fechaPago | date: 'medium' }}</dd>
      </dl>
      <button type="button" (click)="cerrar.emit()">Cerrar</button>
    </section>
  `,
  styles: ['.detalle { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-4); } dt { font-weight: 600; } dd { margin: 0 0 var(--space-2); }'],
})
export class DetallePagoComponent {
  @Input({ required: true }) pago!: Pago;
  @Output() cerrar = new EventEmitter<void>();
}
