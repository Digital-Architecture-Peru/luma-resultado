import type { Card } from '../../domain/card'

// Datos 100% ficticios.
export const cardFixtures: Card[] = [
  {
    id: 'c-001',
    alias: 'Visa Signature',
    brand: 'Visa',
    type: 'credit',
    status: 'active',
    last4: '4821',
    holder: 'ANA PEREZ DEMO',
    currency: 'PEN',
    creditLimit: 10000,
    available: 6500,
    balance: 3500,
    cutOffDate: '2026-10-20',
    paymentDueDate: '2026-11-05',
    expiry: '2028-08'
  },
  {
    id: 'c-002',
    alias: 'Mastercard Débito',
    brand: 'Mastercard',
    type: 'debit',
    status: 'active',
    last4: '9034',
    holder: 'ANA PEREZ DEMO',
    currency: 'PEN',
    available: 2150.75,
    balance: 2150.75,
    expiry: '2027-03'
  },
  {
    id: 'c-003',
    alias: 'Visa Clásica',
    brand: 'Visa',
    type: 'credit',
    status: 'blocked',
    last4: '1177',
    holder: 'ANA PEREZ DEMO',
    currency: 'PEN',
    creditLimit: 3000,
    available: 0,
    balance: 3000,
    cutOffDate: '2026-10-12',
    paymentDueDate: '2026-10-28',
    expiry: '2026-12'
  }
]
