import type { Card, CardSummary, Movement } from '../domain/card'
import { cardsFixture, movementsFixture } from '../mocks/cards.fixture'
import type { CardsGateway } from './CardsGateway'

export class MockCardsGateway implements CardsGateway {
  constructor(
    private readonly cards: Card[] = cardsFixture,
    private readonly movements: Record<string, Movement[]> = movementsFixture
  ) {}

  async listCards(): Promise<CardSummary[]> {
    return this.cards.map(({ id, alias, network, type, last4, status, currency, availableBalance }) => ({
      id,
      alias,
      network,
      type,
      last4,
      status,
      currency,
      availableBalance
    }))
  }

  async getCard(id: string): Promise<Card | null> {
    const found = this.cards.find((c) => c.id === id)
    return found ? { ...found } : null
  }

  async getMovements(id: string): Promise<Movement[]> {
    return [...(this.movements[id] ?? [])]
  }
}
