import { Component, OnInit, signal } from '@angular/core';
import { Card } from '../data/card.model';
import { CardService } from '../data/card.service';
import { CardsLayoutComponent } from '../templates/cards-layout.component';
import { CardListComponent } from '../organisms/card-list.component';
import { CardDetailComponent } from '../organisms/card-detail.component';

@Component({
  selector: 'app-cards-page',
  standalone: true,
  imports: [CardsLayoutComponent, CardListComponent, CardDetailComponent],
  template: `
    <app-cards-layout>
      @if (loading()) {
        <p role="status">Cargando tarjetas…</p>
      }
      @if (error()) {
        <p role="alert">{{ error() }}</p>
      }
      @if (selectedCard(); as card) {
        <app-card-detail [card]="card" (closed)="selectedCard.set(null)" />
      } @else if (!loading() && !error()) {
        <app-card-list [cards]="cards()" (selected)="open($event)" />
      }
    </app-cards-layout>
  `,
})
export class CardsPageComponent implements OnInit {
  readonly cards = signal<Card[]>([]);
  readonly selectedCard = signal<Card | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor(private readonly service: CardService) {}

  ngOnInit(): void {
    this.service.list().subscribe({
      next: (cards) => {
        this.cards.set(cards);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No fue posible consultar tus tarjetas. Intenta nuevamente.');
        this.loading.set(false);
      },
    });
  }

  open(cardId: string): void {
    this.error.set(null);
    this.service.get(cardId).subscribe({
      next: (card) => this.selectedCard.set(card),
      error: () => this.error.set('No fue posible consultar el detalle de la tarjeta.'),
    });
  }
}
