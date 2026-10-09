import { Component, Input } from '@angular/core';
import { CardSummary } from '../data/card.model';
import { CardItemComponent } from '../molecules/card-item.component';

/** Organismo: listado de tarjetas con estado vacío. */
@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CardItemComponent],
  template: `
    @if (cards.length === 0) {
      <p>No tienes tarjetas registradas.</p>
    } @else {
      <ul class="list">
        @for (card of cards; track card.id) {
          <li><app-card-item [card]="card" /></li>
        }
      </ul>
    }
  `,
  styles: [`
    .list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-4);
            grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }
  `],
})
export class CardListComponent {
  @Input({ required: true }) cards: CardSummary[] = [];
}
