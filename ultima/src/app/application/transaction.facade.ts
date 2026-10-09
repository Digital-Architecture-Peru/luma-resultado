import { computed, signal } from '@angular/core';
import { Card } from '../domain/card';
import { CardGateway } from '../domain/card.gateway';
import { TransactionReceipt, TransactionRejectedError, TransactionRequest } from '../domain/transaction';

export const GENERIC_ERROR = 'No se pudo procesar la solicitud. Intente nuevamente.';

/** Fachada de estado para la página: oculta el gateway y expone señales de solo lectura. */
export class TransactionFacade {
  private readonly cardsState = signal<readonly Card[]>([]);
  private readonly selectedIdState = signal<string | null>(null);
  private readonly loadingState = signal(false);
  private readonly submittingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly historyState = signal<readonly TransactionReceipt[]>([]);

  readonly cards = this.cardsState.asReadonly();
  readonly selectedId = this.selectedIdState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly submitting = this.submittingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly history = this.historyState.asReadonly();
  readonly selectedCard = computed(() => this.cardsState().find((c) => c.id === this.selectedIdState()));
  readonly lastReceipt = computed(() => this.historyState()[0]);

  constructor(private readonly gateway: CardGateway) {}

  async load(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);
    try {
      const cards = await this.gateway.listCards();
      this.cardsState.set(cards);
      const firstActive = cards.find((c) => c.status === 'ACTIVE') ?? cards[0];
      this.selectedIdState.set(firstActive?.id ?? null);
    } catch {
      this.errorState.set(GENERIC_ERROR);
    } finally {
      this.loadingState.set(false);
    }
  }

  select(cardId: string): void {
    this.errorState.set(null);
    this.selectedIdState.set(cardId);
  }

  async submit(request: TransactionRequest): Promise<void> {
    if (this.submittingState()) {
      return;
    }
    this.submittingState.set(true);
    this.errorState.set(null);
    try {
      const receipt = await this.gateway.execute(request);
      this.cardsState.set(await this.gateway.listCards());
      this.historyState.update((history) => [receipt, ...history]);
    } catch (err: unknown) {
      this.errorState.set(err instanceof TransactionRejectedError ? err.message : GENERIC_ERROR);
    } finally {
      this.submittingState.set(false);
    }
  }
}
