import type { Card } from '../domain/card'
import type { CardRepository } from '../domain/cardRepository'
import { fixtureCards } from './fixtures/cards'

export class InMemoryCardRepository implements CardRepository {
  constructor(private readonly cards: Card[] = fixtureCards) {}

  async listCards(): Promise<Card[]> {
    return this.cards.map((c) => ({ ...c }))
  }
}
