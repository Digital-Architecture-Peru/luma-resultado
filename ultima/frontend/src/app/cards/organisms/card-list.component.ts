import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardSummary } from '../data/card.model';
import { CardSummaryItemComponent } from '../molecules/card-summary-item.component';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CardSummaryItemComponent],
  template: `
    @if (cards.length === 0) {
      <p class="empty">No tienes tarjetas registradas.</p>
    } @else {
      <ul class="list" aria-label="Mis tarjetas">
        @for (card of cards; track card.id) {
          <li>
            <app-card-summary-item [card]="card" [selected]="card.id === selectedId"
                                   (chosen)="selectedCard.emit($event)" />
          </li>
        }
      </ul>
    }
  `,
  styles: [`
    .list { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
    .empty { color: var(--muted); }
  `],
})
export class CardListComponent {
  @Input() cards: CardSummary[] = [];
  @Input() selectedId: string | null = null;
  @Output() selectedCard = new EventEmitter<string>();
}
