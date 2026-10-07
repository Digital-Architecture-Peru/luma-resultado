import type { Card } from '../domain/card'
import type { Movement } from '../domain/movement'

// Datos ficticios.
export const fixtureCards: Card[] = [
  { id: 'c1', alias: 'Compras diarias', brand: 'Visa', kind: 'credito', last4: '1234', status: 'activa', currency: 'USD', availableBalance: 1850.5, creditLimit: 3000, expiry: '08/28' },
  { id: 'c2', alias: 'Cuenta sueldo', brand: 'Mastercard', kind: 'debito', last4: '5678', status: 'activa', currency: 'USD', availableBalance: 920.75, expiry: '03/27' },
  { id: 'c3', alias: 'Viajes', brand: 'Visa', kind: 'credito', last4: '9012', status: 'bloqueada', currency: 'USD', availableBalance: 0, creditLimit: 1500, expiry: '11/26' },
]

export const fixtureMovements: Movement[] = [
  { id: 'm1', cardId: 'c1', date: '2026-09-02', description: 'Supermercado Ejemplo', amount: -64.2, currency: 'USD', status: 'procesado' },
  { id: 'm2', cardId: 'c1', date: '2026-09-15', description: 'Restaurante Demo', amount: -32.9, currency: 'USD', status: 'procesado' },
  { id: 'm3', cardId: 'c1', date: '2026-09-28', description: 'Pago de tarjeta', amount: 200, currency: 'USD', status: 'procesado' },
  { id: 'm4', cardId: 'c1', date: '2026-10-03', description: 'Tienda en linea Demo', amount: -120, currency: 'USD', status: 'pendiente' },
  { id: 'm5', cardId: 'c2', date: '2026-09-10', description: 'Deposito de sueldo', amount: 1500, currency: 'USD', status: 'procesado' },
  { id: 'm6', cardId: 'c2', date: '2026-09-18', description: 'Servicio de transporte', amount: -12.5, currency: 'USD', status: 'procesado' },
]
