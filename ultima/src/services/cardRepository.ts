import type { Card } from '../domain/card';

/** Puerto de lectura: la integración real (sin definir) se implementa detrás de esta interfaz. */
export interface CardRepository {
  list(): Promise<Card[]>;
}

const SAMPLE_CARDS: readonly Card[] = [
  {
    id: 'c-001', alias: 'Visa Platinum', holder: 'Ana Ejemplo', brand: 'Visa', type: 'credito',
    last4: '4821', status: 'activa', expiry: '09/28', currency: 'PEN',
    creditLimit: 15000, availableBalance: 11250.5,
  },
  {
    id: 'c-002', alias: 'Débito Sueldo', holder: 'Ana Ejemplo', brand: 'Mastercard', type: 'debito',
    last4: '1093', status: 'activa', expiry: '03/27', currency: 'PEN',
    creditLimit: null, availableBalance: 3420,
  },
  {
    id: 'c-003', alias: 'Mastercard Gold', holder: 'Ana Ejemplo', brand: 'Mastercard', type: 'credito',
    last4: '7710', status: 'bloqueada', expiry: '12/26', currency: 'USD',
    creditLimit: 5000, availableBalance: 0,
  },
  {
    id: 'c-004', alias: 'Visa Clásica', holder: 'Ana Ejemplo', brand: 'Visa', type: 'credito',
    last4: '3356', status: 'vencida', expiry: '01/24', currency: 'PEN',
    creditLimit: 3000, availableBalance: 3000,
  },
];

export class InMemoryCardRepository implements CardRepository {
  async list(): Promise<Card[]> {
    return SAMPLE_CARDS.map((card) => ({ ...card }));
  }
}
