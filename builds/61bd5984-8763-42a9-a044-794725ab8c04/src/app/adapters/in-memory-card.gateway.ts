import { Card } from '../domain/card';
import { CardGateway } from '../domain/card.gateway';
import {
  TransactionReceipt,
  TransactionRejectedError,
  TransactionRequest,
  applyTransaction,
  hasErrors,
  validateTransaction,
} from '../domain/transaction';

/** Adaptador en memoria: simula el backend sin red ni persistencia. */
export class InMemoryCardGateway extends CardGateway {
  private cards: Card[];
  private sequence = 0;

  constructor(
    seed: readonly Card[],
    private readonly now: () => Date = () => new Date(),
    private readonly latencyMs = 0,
  ) {
    super();
    this.cards = [...seed];
  }

  async listCards(): Promise<readonly Card[]> {
    await this.simulateLatency();
    return [...this.cards];
  }

  async execute(request: TransactionRequest): Promise<TransactionReceipt> {
    await this.simulateLatency();
    const card = this.cards.find((c) => c.id === request.cardId);
    const errors = validateTransaction(card, request);
    if (!card || request.amountCents === null || hasErrors(errors)) {
      throw new TransactionRejectedError(errors);
    }
    const updated = applyTransaction(card, request.type, request.amountCents);
    this.cards = this.cards.map((c) => (c.id === card.id ? updated : c));
    this.sequence += 1;
    return {
      reference: `TRX-${String(this.sequence).padStart(6, '0')}`,
      cardId: card.id,
      type: request.type,
      amountCents: request.amountCents,
      description: request.description.trim(),
      availableAfterCents: updated.availableCents,
      at: this.now().toISOString(),
    };
  }

  private simulateLatency(): Promise<void> {
    return this.latencyMs > 0 ? new Promise((resolve) => setTimeout(resolve, this.latencyMs)) : Promise.resolve();
  }
}
