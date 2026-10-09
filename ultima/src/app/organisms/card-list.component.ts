import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardItemComponent } from '../molecules/card-item.component';
import { Card } from '../domain/card.model';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CardItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cards.length === 0) {
      <p class="empty">No hay tarjetas que coincidan con la búsqueda.</p>
    } @else {
      <ul class="grid">
        @for (card of cards; track card.id) {
          <li><app-card-item [card]="card" /></li>
        }
      </ul>
    }
  `,
})
export class CardListComponent {
  @Input({ required: true }) cards: readonly Card[] = [];
}
