import type { Card } from '../../domain/card'

// Datos ficticios.
export const fixtureCards: Card[] = [
  {
    id: 'c-001',
    last4: '4821',
    brand: 'Visa',
    type: 'CREDITO',
    status: 'ACTIVA',
    holderName: 'Ana Ejemplo Prueba',
    creditLimit: 15000,
    availableBalance: 9650.75,
    statementBalance: 2340.5,
    dueDate: '2026-10-25'
  },
  {
    id: 'c-002',
    last4: '9034',
    brand: 'Mastercard',
    type: 'DEBITO',
    status: 'ACTIVA',
    holderName: 'Ana Ejemplo Prueba',
    availableBalance: 1280.1
  },
  {
    id: 'c-003',
    last4: '1177',
    brand: 'Visa',
    type: 'CREDITO',
    status: 'BLOQUEADA',
    holderName: 'Ana Ejemplo Prueba',
    creditLimit: 5000,
    availableBalance: 0,
    statementBalance: 5000,
    dueDate: '2026-10-12'
  }
]
