import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Card } from '../../../core/cards/models/card.model';
import { Amount } from '../atoms/amount';
import { CardNumber } from '../atoms/card-number';
import { StatusBadge } from '../atoms/status-badge';

@Component({
  selector: 'app-card-summary',
  imports: [Amount, CardNumber, StatusBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="summary">
      <header>
        <h3>{{ card().alias }}</h3>
        <app-status-badge [status]="card().status" />
      </header>
      <p class="meta">{{ card().brand }} · <app-card-number [value]="card().maskedNumber" /></p>
      <p class="balance">
        Disponible: <app-amount [value]="card().availableBalance" [currency]="card().currency" />
      </p>
      <button type="button" class="btn" (click)="selected.emit(card().id)">
        Ver detalle<span class="sr-only"> de {{ card().alias }}</span>
      </button>
    </article>
  `,
  styles: `
    .summary { border: 1px solid var(--border); border-radius: 0.75rem; padding: 1rem; background: var(--surface); }
    header { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
    h3 { margin: 0; font-size: 1.1rem; }
    .meta { color: var(--muted); margin: 0.4rem 0; }
    .balance { margin: 0.4rem 0 0.8rem; }
  `,
})
export class CardSummary {
  readonly card = input.required<Card>();
  readonly selected = output<string>();
}
