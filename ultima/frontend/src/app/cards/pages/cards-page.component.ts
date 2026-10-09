import { Component, OnInit, inject, signal } from '@angular/core';
import { CardApiService } from '../data/card-api.service';
import { CardSummary } from '../data/card.model';
import { CardListComponent } from '../organisms/card-list.component';
import { CardsLayoutComponent } from '../templates/cards-layout.component';

type ViewState = 'loading' | 'ready' | 'error';

@Component({
  selector: 'app-cards-page',
  standalone: true,
  imports: [CardsLayoutComponent, CardListComponent],
  template: `
    <app-cards-layout title="Mis tarjetas">
      @switch (state()) {
        @case ('loading') { <p role="status">Cargando tarjetas…</p> }
        @case ('error') { <p role="alert">No fue posible consultar tus tarjetas. Intenta nuevamente.</p> }
        @default { <app-card-list [cards]="cards()" /> }
      }
    </app-cards-layout>
  `,
})
export class CardsPageComponent implements OnInit {
  private readonly api = inject(CardApiService);

  readonly state = signal<ViewState>('loading');
  readonly cards = signal<CardSummary[]>([]);

  ngOnInit(): void {
    this.api.list().subscribe({
      next: (cards) => {
        this.cards.set(cards);
        this.state.set('ready');
      },
      error: () => this.state.set('error'),
    });
  }
}
