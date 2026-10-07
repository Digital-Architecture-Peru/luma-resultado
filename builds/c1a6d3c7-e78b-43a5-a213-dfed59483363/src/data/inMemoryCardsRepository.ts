import type { Card } from '../domain/card'
import type { CardsRepository } from './CardsRepository'
import { cardFixtures } from './fixtures/cards'

export class InMemoryCardsRepository implements CardsRepository {
  constructor(
    private readonly cards: Card[] = cardFixtures,
    private readonly delayMs = 0
  ) {}

  private async wait(): Promise<void> {
    if (this.delayMs > 0) await new Promise((r) => setTimeout(r, this.delayMs))
  }

  async list(): Promise<Card[]> {
    await this.wait()
    return this.cards.map((c) => ({ ...c }))
  }

  async getById(id: string): Promise<Card | null> {
    await this.wait()
    const found = this.cards.find((c) => c.id === id)
    return found ? { ...found } : null
  }
}
