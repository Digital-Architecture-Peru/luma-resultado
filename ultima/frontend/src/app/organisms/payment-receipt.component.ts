import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AmountDisplayComponent } from '../atoms/amount-display.component';
import { ButtonComponent } from '../atoms/button.component';
import { Payment } from '../core/models';

@Component({
  selector: 'app-payment-receipt',
  standalone: true,
  imports: [AmountDisplayComponent, ButtonComponent, DatePipe],
  template: `
    <h2>Comprobante de pago</h2>
    <p role="status" [class.error]="payment.status === 'REJECTED'">
      @if (payment.status === 'COMPLETED') { Pago realizado con éxito. }
      @else if (payment.status === 'REJECTED') { Pago rechazado: {{ payment.failureReason }} }
      @else { Pago en proceso. }
    </p>
    <dl class="summary">
      <dt>N.º de operación</dt><dd>{{ payment.id }}</dd>
      <dt>Origen</dt><dd>{{ payment.sourceAccountId }}</dd>
      <dt>Destino</dt><dd>{{ payment.beneficiaryAccount }}</dd>
      <dt>Monto</dt><dd><app-amount-display [amount]="payment.amount" [currency]="payment.currency"></app-amount-display></dd>
      <dt>Fecha</dt><dd>{{ payment.createdAt | date: 'dd/MM/yyyy HH:mm' }}</dd>
    </dl>
    <div class="actions">
      <app-button label="Nuevo pago" (click)="another.emit()"></app-button>
    </div>`
})
export class PaymentReceiptComponent {
  @Input({ required: true }) payment!: Payment;
  @Output() another = new EventEmitter<void>();
}
