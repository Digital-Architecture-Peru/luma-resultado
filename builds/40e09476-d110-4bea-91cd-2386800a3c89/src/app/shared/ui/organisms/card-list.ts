import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Card } from '../../../core/cards/models/card.model';
import { CardSummary } from '../molecules/card-summary';

@Component({
  selector: 'app-card-list',
  imports: [CardSummary],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="grid" aria-label="Listado de tarjetas">
      @for (card of cards(); track card.id) {
        <li><app-card-summary [card]="card" (selected)="selected.emit($event)" /></li>
      }
    </ul>
  `,
  styles: `
    .grid { list-style: none; margin: 0; padding: 0; display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }
  `,
})
export class CardList {
  readonly cards = input.required<readonly Card[]>();
  readonly selected = output<string>();
}
