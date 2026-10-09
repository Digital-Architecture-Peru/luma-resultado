import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MoneyPipe } from '../atoms/money.pipe';
import { PaymentFlow } from '../domain/payment-flow';

/** Organismo: comprobante del pago realizado. */
@Component({
  selector: 'app-payment-receipt',
  standalone: true,
  imports: [MoneyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (flow.receipt(); as receipt) {
      <section aria-labelledby="receipt-title">
        <h2 id="receipt-title">Pago realizado</h2>
        <p role="status">Tu pago de {{ receipt.amount | money }} se registró correctamente.</p>
        <dl class="details">
          <dt>Referencia</dt>
          <dd>{{ receipt.reference }}</dd>
          <dt>Fecha</dt>
          <dd>{{ receipt.date }}</dd>
          <dt>Nueva deuda de la tarjeta</dt>
          <dd>{{ receipt.newCardBalance | money }}</dd>
        </dl>
        <button type="button" class="btn btn--primary" (click)="flow.reset()">Realizar otro pago</button>
      </section>
    }
  `,
})
export class PaymentReceiptComponent {
  protected readonly flow = inject(PaymentFlow);
}
