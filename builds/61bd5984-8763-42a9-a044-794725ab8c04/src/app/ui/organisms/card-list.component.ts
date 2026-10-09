import { Component, input, output } from '@angular/core';
import { Card } from '../../domain/card';
import { CardItemComponent } from '../molecules/card-item.component';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CardItemComponent],
  template: `
    <section aria-labelledby="cards-title">
      <h2 id="cards-title">Mis tarjetas</h2>
      @if (cards().length === 0) {
        <p class="muted">No tiene tarjetas disponibles.</p>
      } @else {
        <div class="card-grid">
          @for (card of cards(); track card.id) {
            <app-card-item [card]="card" [selected]="card.id === selectedId()" (choose)="selectCard.emit($event)" />
          }
        </div>
      }
    </section>
  `,
})
export class CardListComponent {
  readonly cards = input.required<readonly Card[]>();
  readonly selectedId = input<string | null>(null);
  readonly selectCard = output<string>();
}
