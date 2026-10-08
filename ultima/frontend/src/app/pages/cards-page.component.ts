import { Component, OnInit, inject, signal } from '@angular/core';
import { CardsApiService } from '../core/cards-api.service';
import { Card, LoadState } from '../core/models';
import { CardsLayoutComponent } from '../templates/cards-layout.component';
import { CardListComponent } from '../organisms/card-list.component';

@Component({
  selector: 'app-cards-page',
  standalone: true,
  imports: [CardsLayoutComponent, CardListComponent],
  template: `
    <app-cards-layout title="Mis tarjetas">
      @switch (state()) {
        @case ('loading') { <p class="state" role="status">Cargando tarjetas…</p> }
        @case ('error') { <p class="state state--error" role="alert">No se pudo cargar la información. Intenta nuevamente.</p> }
        @default { <app-card-list [cards]="cards()" /> }
      }
    </app-cards-layout>
  `,
})
export class CardsPageComponent implements OnInit {
  private readonly api = inject(CardsApiService);

  readonly state = signal<LoadState>('loading');
  readonly cards = signal<Card[]>([]);

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
