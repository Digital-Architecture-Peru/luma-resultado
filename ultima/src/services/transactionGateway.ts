import { TransactionError } from '../domain/types';
import type { Card, Transaction, TransactionInput } from '../domain/types';

/** Puerto: la integración real (HTTP, SDK móvil) está sin definir y se implementará aquí. */
export interface TransactionGateway {
  listCards(): Promise<Card[]>;
  listTransactions(): Promise<Transaction[]>;
  submit(input: TransactionInput): Promise<Transaction>;
}

const SEED_CARDS: Card[] = [
  { id: 'c1', alias: 'Nómina', brand: 'Visa', last4: '4242', available: 1500, status: 'active' },
  { id: 'c2', alias: 'Viajes', brand: 'Mastercard', last4: '1881', available: 320.5, status: 'active' },
  { id: 'c3', alias: 'Antigua', brand: 'Visa', last4: '0007', available: 0, status: 'blocked' },
];

/** Adaptador en memoria con datos ficticios; el reloj y el generador de ids son inyectables. */
export function createInMemoryGateway(
  now: () => Date = () => new Date(),
  cards: Card[] = SEED_CARDS.map((c) => ({ ...c })),
): TransactionGateway {
  const transactions: Transaction[] = [];
  let sequence = 0;

  return {
    async listCards() {
      return cards.map((c) => ({ ...c }));
    },
    async listTransactions() {
      return [...transactions].reverse();
    },
    async submit(input) {
      const card = cards.find((c) => c.id === input.cardId);
      if (!card) throw new TransactionError('Tarjeta no encontrada.');
      if (card.status === 'blocked') throw new TransactionError('La tarjeta está bloqueada.');
      if (input.amount <= 0) throw new TransactionError('Monto inválido.');
      if (input.amount > card.available) throw new TransactionError('Saldo insuficiente.');

      card.available = Math.round((card.available - input.amount) * 100) / 100;
      sequence += 1;
      const transaction: Transaction = {
        ...input,
        id: `tx-${sequence}`,
        createdAt: now().toISOString(),
        status: 'approved',
      };
      transactions.push(transaction);
      return transaction;
    },
  };
}
