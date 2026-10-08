import { Component, OnInit, signal } from '@angular/core';
import { CardDetail, CardSummary } from '../data/card.model';
import { CardsApiService } from '../data/cards-api.service';
import { CardDetailPanelComponent } from '../organisms/card-detail-panel.component';
import { CardListComponent } from '../organisms/card-list.component';
import { CardsLayoutComponent } from '../templates/cards-layout.component';

type LoadState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-cards-page',
  standalone: true,
  imports: [CardsLayoutComponent, CardListComponent, CardDetailPanelComponent],
  template: `
    <app-cards-layout>
      <div status role="status">
        @if (state() === 'loading') { <p>Cargando tarjetas…</p> }
        @if (state() === 'error') { <p class="error">{{ errorMessage() }}</p> }
      </div>
      <app-card-list list [cards]="cards()" [selectedId]="detail()?.id ?? null"
                     (selectedCard)="select($event)" />
      <app-card-detail-panel detail [card]="detail()" />
    </app-cards-layout>
  `,
  styles: [`.error { color: var(--danger); font-weight: 600; }`],
})
export class CardsPageComponent implements OnInit {
  readonly state = signal<LoadState>('loading');
  readonly errorMessage = signal('');
  readonly cards = signal<CardSummary[]>([]);
  readonly detail = signal<CardDetail | null>(null);

  constructor(private readonly api: CardsApiService) {}

  ngOnInit(): void {
    this.api.getCards().subscribe({
      next: (cards) => {
        this.cards.set(cards);
        this.state.set('success');
      },
      error: () => this.fail('No pudimos cargar tus tarjetas. Intenta nuevamente.'),
    });
  }

  select(id: string): void {
    this.api.getCard(id).subscribe({
      next: (card) => this.detail.set(card),
      error: () => this.fail('No pudimos cargar el detalle de la tarjeta.'),
    });
  }

  private fail(message: string): void {
    this.errorMessage.set(message);
    this.state.set('error');
  }
}
