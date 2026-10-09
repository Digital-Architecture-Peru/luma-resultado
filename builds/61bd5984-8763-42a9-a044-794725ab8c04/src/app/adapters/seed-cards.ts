import { Card } from '../domain/card';

/** Datos ficticios. */
export const SEED_CARDS: readonly Card[] = [
  {
    id: 'card-1',
    alias: 'Visa Platinum',
    brand: 'VISA',
    last4: '4821',
    status: 'ACTIVE',
    creditLimitCents: 500000,
    availableCents: 320000,
  },
  {
    id: 'card-2',
    alias: 'Mastercard Gold',
    brand: 'MASTERCARD',
    last4: '9034',
    status: 'ACTIVE',
    creditLimitCents: 200000,
    availableCents: 45000,
  },
  {
    id: 'card-3',
    alias: 'Visa Clásica',
    brand: 'VISA',
    last4: '1177',
    status: 'BLOCKED',
    creditLimitCents: 100000,
    availableCents: 100000,
  },
];
