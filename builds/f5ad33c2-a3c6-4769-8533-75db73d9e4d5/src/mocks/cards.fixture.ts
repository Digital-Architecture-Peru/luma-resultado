import type { Card, Movement } from '../domain/card'

// Datos ficticios. No corresponden a clientes ni tarjetas reales.
export const cardsFixture: Card[] = [
  {
    id: 'c-001',
    alias: 'Visa Platinum',
    network: 'VISA',
    type: 'credit',
    last4: '4821',
    status: 'active',
    currency: 'USD',
    availableBalance: 3250.75,
    holder: 'ANA EJEMPLO',
    creditLimit: 5000,
    currentBalance: 1749.25,
    cutoffDate: '2026-10-20',
    dueDate: '2026-11-05',
    minimumPayment: 87.46
  },
  {
    id: 'c-002',
    alias: 'Mastercard Débito',
    network: 'MASTERCARD',
    type: 'debit',
    last4: '9034',
    status: 'active',
    currency: 'USD',
    availableBalance: 812.4,
    holder: 'ANA EJEMPLO',
    creditLimit: 0,
    currentBalance: 0,
    cutoffDate: '2026-10-31',
    dueDate: '2026-10-31',
    minimumPayment: 0
  },
  {
    id: 'c-003',
    alias: 'Visa Clásica',
    network: 'VISA',
    type: 'credit',
    last4: '1177',
    status: 'blocked',
    currency: 'USD',
    availableBalance: 0,
    holder: 'ANA EJEMPLO',
    creditLimit: 1500,
    currentBalance: 1500,
    cutoffDate: '2026-10-12',
    dueDate: '2026-10-28',
    minimumPayment: 75
  }
]

export const movementsFixture: Record<string, Movement[]> = {
  'c-001': [
    { id: 'm-1', date: '2026-10-04', description: 'Supermercado Ejemplo', amount: -85.3, currency: 'USD' },
    { id: 'm-2', date: '2026-10-02', description: 'Pago de tarjeta', amount: 200, currency: 'USD' },
    { id: 'm-3', date: '2026-09-29', description: 'Restaurante Ficticio', amount: -42.1, currency: 'USD' }
  ],
  'c-002': [
    { id: 'm-4', date: '2026-10-05', description: 'Retiro cajero', amount: -60, currency: 'USD' }
  ],
  'c-003': []
}
