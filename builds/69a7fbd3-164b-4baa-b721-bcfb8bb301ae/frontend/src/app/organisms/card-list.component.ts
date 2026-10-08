import { Component, Input } from '@angular/core';
import { Card } from '../core/models';
import { CardSummaryItemComponent } from '../molecules/card-summary-item.component';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CardSummaryItemComponent],
  template: `
    @if (cards.length === 0) {
      <p class="state">No tienes tarjetas para mostrar.</p>
    } @else {
      <ul class="card-list">
        @for (card of cards; track card.id) {
          <li><app-card-summary-item [card]="card" /></li>
        }
      </ul>
    }
  `,
})
export class CardListComponent {
  @Input({ required: true }) cards!: Card[];
}
