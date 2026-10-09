import { Component, input } from '@angular/core';
import { formatCents } from '../../domain/money';
import { TRANSACTION_LABELS, TransactionReceipt } from '../../domain/transaction';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  template: `
    <section aria-labelledby="history-title">
      <h2 id="history-title">Comprobantes de la sesión</h2>
      @if (receipts().length === 0) {
        <p class="muted">Aún no hay transacciones.</p>
      } @else {
        <ul class="history">
          @for (r of receipts(); track r.reference) {
            <li>
              <strong>{{ label(r) }}</strong> · {{ money(r.amountCents) }}
              <span class="muted">· {{ r.reference }} · Disponible: {{ money(r.availableAfterCents) }}</span>
              @if (r.description) {
                <span class="muted">· {{ r.description }}</span>
              }
            </li>
          }
        </ul>
      }
    </section>
  `,
})
export class TransactionHistoryComponent {
  readonly receipts = input.required<readonly TransactionReceipt[]>();

  label(receipt: TransactionReceipt): string {
    return TRANSACTION_LABELS[receipt.type];
  }

  money(cents: number): string {
    return formatCents(cents);
  }
}
