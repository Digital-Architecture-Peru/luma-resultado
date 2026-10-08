import { Component, Input } from '@angular/core';
import { CardSummaryItemComponent } from '../molecules/card-summary-item.component';
import { CardSummary } from '../data/card.model';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CardSummaryItemComponent],
  template: `
    @if (cards.length === 0) {
      <p class="empty">No tienes tarjetas para mostrar.</p>
    } @else {
      <ul class="list">
        @for (card of cards; track card.id) {
          <li><app-card-summary-item [card]="card" /></li>
        }
      </ul>
    }
  `,
  styles: [
    `
      .list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-3); }
      .empty { color: var(--muted); }
    `,
  ],
})
export class CardListComponent {
  @Input({ required: true }) cards: CardSummary[] = [];
}
