import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AmountDisplayComponent } from '../atoms/amount-display.component';
import { ButtonComponent } from '../atoms/button.component';
import { PaymentRequest } from '../core/models';

@Component({
  selector: 'app-payment-confirm',
  standalone: true,
  imports: [AmountDisplayComponent, ButtonComponent],
  template: `
    <h2>Confirme su pago</h2>
    <dl class="summary">
      <dt>Origen</dt><dd>{{ request.sourceAccountId }}</dd>
      <dt>Destino</dt><dd>{{ request.beneficiaryAccount }}</dd>
      <dt>Monto</dt><dd><app-amount-display [amount]="request.amount" [currency]="request.currency"></app-amount-display></dd>
      <dt>Concepto</dt><dd>{{ request.concept || '—' }}</dd>
    </dl>
    @if (errorMessage) {
      <p class="error" role="alert">{{ errorMessage }}</p>
    }
    <div class="actions">
      <app-button label="Volver" variant="secondary" [disabled]="busy" (click)="back.emit()"></app-button>
      <app-button label="Confirmar pago" [disabled]="busy" (click)="confirmed.emit()"></app-button>
    </div>`
})
export class PaymentConfirmComponent {
  @Input({ required: true }) request!: PaymentRequest;
  @Input() busy = false;
  @Input() errorMessage: string | null = null;
  @Output() confirmed = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
}
