import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../data/card.model';
import { CardSummaryComponent } from '../molecules/card-summary.component';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CardSummaryComponent],
  template: `
    @if (cards.length === 0) {
      <p>No tienes tarjetas registradas.</p>
    } @else {
      <ul class="grid">
        @for (card of cards; track card.id) {
          <li><app-card-summary [card]="card" (selected)="selected.emit($event)" /></li>
        }
      </ul>
    }
  `,
  styles: [
    `
      .grid { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }
    `,
  ],
})
export class CardListComponent {
  @Input({ required: true }) cards: Card[] = [];
  @Output() selected = new EventEmitter<string>();
}
