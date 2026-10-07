import type { Card, CardMovement } from '../domain/card'
import type { CardsGateway } from './cards-gateway'

const CARDS: Card[] = [
  {
    id: 'c-001',
    alias: 'Visa Clásica',
    brand: 'Visa',
    last4: '4821',
    holderName: 'ANA PRUEBA LOPEZ',
    status: 'ACTIVE',
    currency: 'USD',
    creditLimit: 5000,
    availableBalance: 3250.75,
    expiry: '09/28',
  },
  {
    id: 'c-002',
    alias: 'Mastercard Oro',
    brand: 'Mastercard',
    last4: '1190',
    holderName: 'ANA PRUEBA LOPEZ',
    status: 'BLOCKED',
    currency: 'USD',
    creditLimit: 8000,
    availableBalance: 0,
    expiry: '03/27',
  },
]

const MOVEMENTS: CardMovement[] = [
  { id: 'm-1', cardId: 'c-001', date: '2026-10-01', description: 'Supermercado Ejemplo', amount: -120.5, currency: 'USD' },
  { id: 'm-2', cardId: 'c-001', date: '2026-09-28', description: 'Pago de tarjeta', amount: 500, currency: 'USD' },
  { id: 'm-3', cardId: 'c-001', date: '2026-09-25', description: 'Restaurante Demo', amount: -48.9, currency: 'USD' },
  { id: 'm-4', cardId: 'c-002', date: '2026-08-12', description: 'Tienda en línea Demo', amount: -75, currency: 'USD' },
]

export class MockCardsGateway implements CardsGateway {
  constructor(private readonly latencyMs = 150) {}

  private delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.latencyMs))
  }

  async listCards(): Promise<Card[]> {
    await this.delay()
    return CARDS.map((c) => ({ ...c }))
  }

  async getMovements(cardId: string): Promise<CardMovement[]> {
    await this.delay()
    return MOVEMENTS.filter((m) => m.cardId === cardId).map((m) => ({ ...m }))
  }
}
