import { Injectable, computed, inject, signal } from '@angular/core';
import { CardsGateway } from '../data/cards.gateway';
import { Card } from '../domain/card.model';

/** Estado solo en memoria (AD4): sin localStorage ni sessionStorage. */
@Injectable()
export class CardsStore {
  private readonly gateway = inject(CardsGateway);

  private readonly _cards = signal<Card[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _selected = signal<Card | null>(null);
  private readonly _notFound = signal(false);

  readonly cards = this._cards.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selected = this._selected.asReadonly();
  readonly notFound = this._notFound.asReadonly();
  readonly isEmpty = computed(() => !this._loading() && !this._error() && this._cards().length === 0);

  loadCards(): void {
    this._loading.set(true);
    this._error.set(null);
    this.gateway.list().subscribe({
      next: (cards) => {
        this._cards.set(cards);
        this._loading.set(false);
      },
      error: () => {
        this._cards.set([]);
        this._error.set('No se pudo cargar las tarjetas. Intente nuevamente.');
        this._loading.set(false);
      },
    });
  }

  loadCard(id: string): void {
    this._loading.set(true);
    this._error.set(null);
    this._notFound.set(false);
    this._selected.set(null);
    this.gateway.getById(id).subscribe({
      next: (card) => {
        this._selected.set(card);
        this._notFound.set(card === null);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('No se pudo cargar el detalle de la tarjeta.');
        this._loading.set(false);
      },
    });
  }
}
