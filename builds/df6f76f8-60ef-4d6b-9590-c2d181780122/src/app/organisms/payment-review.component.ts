import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MoneyPipe } from '../atoms/money.pipe';
import { PaymentFlow } from '../domain/payment-flow';

/** Organismo: confirmación previa a ejecutar la transacción. */
@Component({
  selector: 'app-payment-review',
  standalone: true,
  imports: [MoneyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="review-title">
      <h2 id="review-title">Confirma tu pago</h2>
      <dl class="details">
        <dt>Tarjeta</dt>
        <dd>{{ flow.selectedCard()?.alias }} {{ flow.selectedCard()?.maskedNumber }}</dd>
        <dt>Cuenta de origen</dt>
        <dd>{{ flow.selectedAccount()?.alias }} {{ flow.selectedAccount()?.maskedNumber }}</dd>
        <dt>Monto</dt>
        <dd>{{ flow.amount() | money }}</dd>
      </dl>
      <div class="actions">
        <button type="button" class="btn" (click)="flow.back()" [disabled]="flow.loading()">Volver</button>
        <button type="button" class="btn btn--primary" (click)="flow.confirm()" [disabled]="flow.loading()">
          {{ flow.loading() ? 'Procesando…' : 'Confirmar pago' }}
        </button>
      </div>
    </section>
  `,
})
export class PaymentReviewComponent {
  protected readonly flow = inject(PaymentFlow);
}
