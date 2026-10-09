import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppButtonComponent } from '../atoms/app-button.component';
import { StatusBadgeComponent } from '../atoms/status-badge.component';
import { Payment } from '../models/payment.models';

@Component({
  selector: 'app-payment-receipt',
  standalone: true,
  imports: [DatePipe, DecimalPipe, StatusBadgeComponent, AppButtonComponent],
  template: `
    <section aria-labelledby="receipt-title" role="status">
      <h2 id="receipt-title">Comprobante</h2>
      <app-status-badge [status]="payment.status" />
      <dl>
        <dt>Número</dt>
        <dd>{{ payment.id }}</dd>
        <dt>Cuenta destino</dt>
        <dd>{{ payment.targetAccount }}</dd>
        <dt>Monto</dt>
        <dd>{{ payment.amount | number: '1.2-2' }} {{ payment.currency }}</dd>
        @if (payment.reference) {
          <dt>Referencia</dt>
          <dd>{{ payment.reference }}</dd>
        }
        <dt>Fecha</dt>
        <dd>{{ payment.createdAt | date: 'medium' }}</dd>
      </dl>
      <app-button label="Nuevo pago" variant="secondary" (pressed)="newPayment.emit()" />
    </section>
  `,
  styles: [
    `
      dl {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: var(--space-2) var(--space-4);
        margin-block: var(--space-4);
      }
      dt {
        color: var(--muted);
      }
      dd {
        margin: 0;
        overflow-wrap: anywhere;
      }
    `,
  ],
})
export class PaymentReceiptComponent {
  @Input({ required: true }) payment!: Payment;
  @Output() newPayment = new EventEmitter<void>();
}
