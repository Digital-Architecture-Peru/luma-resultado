import type { Card } from '../domain/card';

// Datos ficticios.
export const cardsFixture: Card[] = [
  {
    id: 'c-001',
    alias: 'Compras diarias',
    brand: 'Visa',
    last4: '1234',
    holder: 'ANA PRUEBA',
    status: 'ACTIVE',
    currency: 'USD',
    creditLimit: 5000,
    availableBalance: 3250.75,
    expiresAt: '12/28',
  },
  {
    id: 'c-002',
    alias: 'Viajes',
    brand: 'Mastercard',
    last4: '5678',
    holder: 'ANA PRUEBA',
    status: 'BLOCKED',
    currency: 'USD',
    creditLimit: 8000,
    availableBalance: 8000,
    expiresAt: '03/27',
  },
  {
    id: 'c-003',
    alias: 'Antigua',
    brand: 'Visa',
    last4: '9012',
    holder: 'ANA PRUEBA',
    status: 'EXPIRED',
    currency: 'USD',
    creditLimit: 1500,
    availableBalance: 0,
    expiresAt: '01/24',
  },
];
