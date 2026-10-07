import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CardItemComponent } from '../molecules/card-item.component';
import { Card } from '../domain/card.model';

/** Organismo: colección de tarjetas con estado vacío. */
@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CardItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cards().length === 0) {
      <p class="empty">No se encontraron tarjetas con los criterios indicados.</p>
    } @else {
      <ul class="grid">
        @for (card of cards(); track card.id) {
          <li><app-card-item [card]="card" /></li>
        }
      </ul>
    }
  `,
  styles: [
    `
      .grid { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); }
      .empty { color: var(--muted); text-align: center; padding: var(--space-6); }
    `,
  ],
})
export class CardListComponent {
  readonly cards = input.required<readonly Card[]>();
}
