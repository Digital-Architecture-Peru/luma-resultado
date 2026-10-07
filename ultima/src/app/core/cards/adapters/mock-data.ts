import { Card } from '../models/card.model';
import { Movement } from '../models/movement.model';

// Datos ficticios.
export const MOCK_CARDS: readonly Card[] = [
  {
    id: 'c-001', alias: 'Visa Oro', maskedNumber: '**** 4821', holder: 'ANA PEREZ DEMO',
    type: 'CREDIT', brand: 'Visa', status: 'ACTIVE', expiry: '08/28',
    availableBalance: 3250.75, creditLimit: 5000, currency: 'USD',
  },
  {
    id: 'c-002', alias: 'Débito Sueldo', maskedNumber: '**** 1096', holder: 'ANA PEREZ DEMO',
    type: 'DEBIT', brand: 'Mastercard', status: 'ACTIVE', expiry: '03/27',
    availableBalance: 812.4, currency: 'USD',
  },
  {
    id: 'c-003', alias: 'Mastercard Viajes', maskedNumber: '**** 7730', holder: 'ANA PEREZ DEMO',
    type: 'CREDIT', brand: 'Mastercard', status: 'BLOCKED', expiry: '11/26',
    availableBalance: 0, creditLimit: 2000, currency: 'USD',
  },
];

export const MOCK_MOVEMENTS: readonly Movement[] = [
  { id: 'm-1', cardId: 'c-001', date: '2026-10-05', description: 'Supermercado Demo', amount: -84.3, currency: 'USD' },
  { id: 'm-2', cardId: 'c-001', date: '2026-10-03', description: 'Restaurante Ejemplo', amount: -32.5, currency: 'USD' },
  { id: 'm-3', cardId: 'c-001', date: '2026-10-01', description: 'Pago de tarjeta', amount: 500, currency: 'USD' },
  { id: 'm-4', cardId: 'c-002', date: '2026-10-04', description: 'Combustible Demo', amount: -45, currency: 'USD' },
  { id: 'm-5', cardId: 'c-002', date: '2026-10-02', description: 'Transferencia recibida', amount: 1200, currency: 'USD' },
];
