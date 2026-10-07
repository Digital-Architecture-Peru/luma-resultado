import type { Card } from '../domain/card'
import type { Movement, MovementFilter } from '../domain/movement'
import type { CardsRepository } from '../domain/cards-repository'
import { fixtureCards, fixtureMovements } from './fixtures'

export interface MockOptions {
  cards?: Card[]
  movements?: Movement[]
  latencyMs?: number
  /** Si se define, las operaciones fallan con este mensaje. */
  failWith?: string
}

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/

export class MockCardsRepository implements CardsRepository {
  private readonly cards: Card[]
  private readonly movements: Movement[]
  private readonly latencyMs: number
  private readonly failWith?: string

  constructor(options: MockOptions = {}) {
    this.cards = options.cards ?? fixtureCards
    this.movements = options.movements ?? fixtureMovements
    this.latencyMs = options.latencyMs ?? 0
    this.failWith = options.failWith
  }

  private async simulate(): Promise<void> {
    if (this.latencyMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.latencyMs))
    }
    if (this.failWith) throw new Error(this.failWith)
  }

  async listCards(): Promise<Card[]> {
    await this.simulate()
    return this.cards.map((c) => ({ ...c }))
  }

  async listMovements(cardId: string, filter: MovementFilter = {}): Promise<Movement[]> {
    await this.simulate()
    const { from, to } = filter
    if ((from && !ISO_DAY.test(from)) || (to && !ISO_DAY.test(to))) {
      throw new Error('Formato de fecha invalido')
    }
    if (from && to && from > to) {
      throw new Error('El rango de fechas es invalido')
    }
    return this.movements
      .filter((m) => m.cardId === cardId)
      .filter((m) => {
        const day = m.date.slice(0, 10)
        return (!from || day >= from) && (!to || day <= to)
      })
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((m) => ({ ...m }))
  }
}
