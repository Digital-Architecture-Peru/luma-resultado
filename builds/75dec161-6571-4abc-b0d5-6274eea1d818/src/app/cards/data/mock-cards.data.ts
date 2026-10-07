import { Card } from '../domain/card.model';

/** Datos totalmente ficticios. */
export const MOCK_CARDS: readonly Card[] = [
  {
    id: 'c-001',
    alias: 'Visa Signature (demo)',
    brand: 'VISA',
    type: 'CREDITO',
    status: 'ACTIVA',
    pan: '4000000000001111',
    holder: 'TITULAR DE PRUEBA',
    creditLine: 10000,
    balance: 2350.75,
    available: 7649.25,
    cutOffDate: '2026-10-25',
  },
  {
    id: 'c-002',
    alias: 'Mastercard Oro (demo)',
    brand: 'MASTERCARD',
    type: 'CREDITO',
    status: 'BLOQUEADA',
    pan: '5000000000002222',
    holder: 'TITULAR DE PRUEBA',
    creditLine: 5000,
    balance: 5000,
    available: 0,
    cutOffDate: '2026-10-12',
  },
  {
    id: 'c-003',
    alias: 'Débito Ahorros (demo)',
    brand: 'VISA',
    type: 'DEBITO',
    status: 'ACTIVA',
    pan: '4000000000003333',
    holder: 'TITULAR DE PRUEBA',
    creditLine: 0,
    balance: 0,
    available: 1820.4,
    cutOffDate: '2026-10-30',
  },
];
