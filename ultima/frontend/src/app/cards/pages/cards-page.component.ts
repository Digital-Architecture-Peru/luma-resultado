import { Component, OnInit, inject, signal } from '@angular/core';
import { CardSummary } from '../data/card.model';
import { CardsApiService } from '../data/cards-api.service';
import { CardListComponent } from '../organisms/card-list.component';
import { CardsLayoutComponent } from '../templates/cards-layout.component';

type LoadState = 'loading' | 'ready' | 'error';

@Component({
  selector: 'app-cards-page',
  standalone: true,
  imports: [CardsLayoutComponent, CardListComponent],
  template: `
    <app-cards-layout title="Mis tarjetas">
      @switch (state()) {
        @case ('loading') { <p role="status">Cargando tarjetas…</p> }
        @case ('error') { <p role="alert">No pudimos cargar tus tarjetas. Intenta nuevamente.</p> }
        @default { <app-card-list [cards]="cards()" /> }
      }
    </app-cards-layout>
  `,
})
export class CardsPageComponent implements OnInit {
  private readonly api = inject(CardsApiService);

  readonly state = signal<LoadState>('loading');
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
