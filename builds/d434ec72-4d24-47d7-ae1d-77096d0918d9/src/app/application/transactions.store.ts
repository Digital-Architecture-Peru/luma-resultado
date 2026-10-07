import { computed, inject, Injectable, signal } from '@angular/core';
import { Card, Transaction, TransactionRejectedError, TransactionRequest } from '../domain/card.model';
import { CardsGateway } from '../domain/cards.gateway';

export const GENERIC_ERROR = 'No se pudo procesar la operación. Inténtalo nuevamente.';

/** Fachada de estado de la feature: la UI solo lee señales y llama a estos casos de uso. */
@Injectable({ providedIn: 'root' })
export class TransactionsStore {
  private readonly gateway = inject(CardsGateway);

  readonly cards = signal<Card[]>([]);
  readonly selectedCardId = signal<string | null>(null);
  readonly history = signal<Transaction[]>([]);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly receipt = signal<Transaction | null>(null);

  readonly selectedCard = computed(
    () => this.cards().find((card) => card.id === this.selectedCardId()) ?? null,
  );

  async load(): Promise<void> {
    try {
      const cards = await this.gateway.listCards();
      this.cards.set(cards);
      const first = cards.find((card) => card.status === 'ACTIVE') ?? cards[0];
      if (first) {
        await this.select(first.id);
      }
    } catch {
      this.error.set(GENERIC_ERROR);
    }
  }

  async select(cardId: string): Promise<void> {
    this.selectedCardId.set(cardId);
    this.error.set(null);
    this.receipt.set(null);
    try {
      this.history.set(await this.gateway.listTransactions(cardId));
    } catch {
      this.error.set(GENERIC_ERROR);
    }
  }

  async submit(request: TransactionRequest): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    this.receipt.set(null);
    try {
      const transaction = await this.gateway.submit(request);
      this.receipt.set(transaction);
      this.cards.set(await this.gateway.listCards());
      this.history.set(await this.gateway.listTransactions(request.cardId));
    } catch (failure: unknown) {
      this.error.set(
        failure instanceof TransactionRejectedError ? failure.message : GENERIC_ERROR,
      );
    } finally {
      this.busy.set(false);
    }
  }
}
