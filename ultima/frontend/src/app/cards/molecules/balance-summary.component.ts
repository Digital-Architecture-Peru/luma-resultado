import { Component, Input } from '@angular/core';
import { AmountComponent } from '../atoms/amount.component';

/** Molécula: límite y disponible de la tarjeta. */
@Component({
  selector: 'app-balance-summary',
  standalone: true,
  imports: [AmountComponent],
  template: `
    <dl class="summary">
      <div><dt>Límite</dt><dd><app-amount [value]="limit" [currency]="currency" /></dd></div>
      <div><dt>Disponible</dt><dd><app-amount [value]="available" [currency]="currency" /></dd></div>
    </dl>
  `,
  styles: [`
    .summary { display: flex; gap: var(--space-6); margin: 0; }
    dt { color: var(--muted); font-size: 0.85rem; }
    dd { margin: 0; }
  `],
})
export class BalanceSummaryComponent {
  @Input({ required: true }) limit = 0;
  @Input({ required: true }) available = 0;
  @Input() currency = 'USD';
}
