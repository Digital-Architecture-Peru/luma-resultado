import { Injectable, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CardsRepository } from './ports/cards.repository';
import { Card } from './models/card.model';
import { Movement } from './models/movement.model';

export type ViewStatus = 'loading' | 'empty' | 'error' | 'data';

@Injectable({ providedIn: 'root' })
export class CardsFacade {
  private readonly repository = inject(CardsRepository);

  readonly cards = signal<Card[]>([]);
  readonly listStatus = signal<ViewStatus>('loading');

  readonly selectedCard = signal<Card | undefined>(undefined);
  readonly movements = signal<Movement[]>([]);
  readonly detailStatus = signal<ViewStatus>('loading');

  loadCards(): void {
    this.listStatus.set('loading');
    this.repository.list().subscribe({
      next: (cards) => {
        this.cards.set(cards);
        this.listStatus.set(cards.length > 0 ? 'data' : 'empty');
      },
      error: () => this.listStatus.set('error'),
    });
  }

  loadDetail(id: string): void {
    this.detailStatus.set('loading');
    forkJoin([this.repository.getById(id), this.repository.movements(id)]).subscribe({
      next: ([card, movements]) => {
        this.selectedCard.set(card);
        this.movements.set(movements);
        // 'empty' en el detalle = tarjeta no encontrada.
        this.detailStatus.set(card ? 'data' : 'empty');
      },
      error: () => this.detailStatus.set('error'),
    });
  }
}
