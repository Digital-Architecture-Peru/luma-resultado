import { Card } from '../domain/card.model';
import { CardRepository } from '../domain/card.repository';

/** Datos ficticios; sin llamadas a sistemas reales. */
export const SAMPLE_CARDS: readonly Card[] = [
  {
    id: 'c-001',
    holder: 'Ana Quispe Ramos',
    last4: '4821',
    brand: 'Visa',
    type: 'credit',
    status: 'active',
    expiry: '08/28',
    currency: 'PEN',
    availableBalance: 4200.5,
    creditLimit: 8000,
  },
  {
    id: 'c-002',
    holder: 'Ana Quispe Ramos',
    last4: '1093',
    brand: 'Mastercard',
    type: 'debit',
    status: 'active',
    expiry: '03/27',
    currency: 'PEN',
    availableBalance: 1530.75,
  },
  {
    id: 'c-003',
    holder: 'Ana Quispe Ramos',
    last4: '7710',
    brand: 'Visa',
    type: 'credit',
    status: 'blocked',
    expiry: '11/26',
    currency: 'USD',
    availableBalance: 300,
    creditLimit: 2000,
  },
  {
    id: 'c-004',
    holder: 'Ana Quispe Ramos',
    last4: '5502',
    brand: 'Mastercard',
    type: 'debit',
    status: 'expired',
    expiry: '01/24',
    currency: 'USD',
    availableBalance: 0,
  },
];

export class InMemoryCardRepository implements CardRepository {
  constructor(
    private readonly cards: readonly Card[] = SAMPLE_CARDS,
    private readonly latencyMs = 250,
  ) {}

  list(): Promise<Card[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.cards]), this.latencyMs);
    });
  }
}
