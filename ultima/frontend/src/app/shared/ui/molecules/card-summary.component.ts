import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardView } from '../../../features/card-transaction/models/card-transaction.models';

@Component({
  selector: 'app-card-summary',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    @if (card) {
      <dl class="summary">
        <dt>Tarjeta</dt><dd>{{ card.brand }} {{ card.maskedPan }} ({{ card.status }})</dd>
        <dt>Disponible</dt><dd>{{ card.availableBalance | currency: 'USD' }}</dd>
        <dt>Limite</dt><dd>{{ card.creditLimit | currency: 'USD' }}</dd>
      </dl>
    }
  `,
  styles: [`
    .summary { display: grid; grid-template-columns: auto 1fr; gap: var(--space-1) var(--space-4); margin: 0; }
    dt { color: var(--muted); }
    dd { margin: 0; font-variant-numeric: tabular-nums; }
  `],
})
export class CardSummaryComponent {
  @Input() card: CardView | null = null;
}
