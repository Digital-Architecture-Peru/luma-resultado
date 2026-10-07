import type { Card, TransactionRecord, TransactionRequest } from '../domain/types';
import { TransactionError, type TransactionGateway } from './transactionGateway';

export const SAMPLE_CARDS: Card[] = [
  { id: 'c1', alias: 'Gastos operativos', last4: '4242', brand: 'VISA', status: 'active', currency: 'COP', availableLimit: 5_000_000 },
  { id: 'c2', alias: 'Viajes corporativos', last4: '1881', brand: 'MASTERCARD', status: 'active', currency: 'USD', availableLimit: 2_500 },
  { id: 'c3', alias: 'Proveedores (bloqueada)', last4: '9001', brand: 'VISA', status: 'blocked', currency: 'COP', availableLimit: 0 },
];

/** Persistencia sin definir: repositorio en memoria con datos ficticios. */
export class InMemoryGateway implements TransactionGateway {
  private cards: Card[];
  private records: TransactionRecord[] = [];
  private sequence = 0;

  constructor(
    cards: Card[] = SAMPLE_CARDS,
    private readonly now: () => Date = () => new Date(),
  ) {
    this.cards = cards.map((card) => ({ ...card }));
  }

  async listCards(): Promise<Card[]> {
    return this.cards.map((card) => ({ ...card }));
  }

  async listTransactions(): Promise<TransactionRecord[]> {
    return [...this.records].reverse();
  }

  async submit(request: TransactionRequest): Promise<TransactionRecord> {
    const card = this.cards.find((c) => c.id === request.cardId);
    if (!card) throw new TransactionError('Tarjeta no encontrada.');
    if (card.status === 'blocked') throw new TransactionError('La tarjeta está bloqueada.');
    if (request.amount > card.availableLimit) throw new TransactionError('Cupo insuficiente.');

    card.availableLimit = Math.round((card.availableLimit - request.amount) * 100) / 100;
    this.sequence += 1;
    const record: TransactionRecord = {
      id: `tx-${String(this.sequence).padStart(4, '0')}`,
      cardId: card.id,
      amount: request.amount,
      currency: card.currency,
      merchant: request.merchant,
      description: request.description,
      status: 'approved',
      createdAt: this.now().toISOString(),
    };
    this.records.push(record);
    return record;
  }
}
