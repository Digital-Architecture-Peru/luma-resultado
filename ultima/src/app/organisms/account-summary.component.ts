import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CurrencyTotal } from '../core/account.model';
import { MoneyPipe } from '../atoms/money.pipe';

/** Organismo: totales por moneda de cuentas activas. */
@Component({
  selector: 'app-account-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoneyPipe],
  template: `
    <section class="summary" aria-label="Resumen por moneda">
      @for (total of totals; track total.currency) {
        <div class="summary-item">
          <h2>Total {{ total.currency }}</h2>
          <p class="amount">{{ total.balance | money: total.currency }}</p>
          <p class="meta">Disponible: {{ total.available | money: total.currency }}</p>
        </div>
      }
    </section>
  `,
})
export class AccountSummaryComponent {
  @Input() totals: readonly CurrencyTotal[] = [];
}
