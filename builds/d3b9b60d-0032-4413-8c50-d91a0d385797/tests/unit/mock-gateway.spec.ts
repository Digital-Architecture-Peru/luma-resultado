import { describe, it, expect } from 'vitest'
import { MockCardsGateway } from '../../src/services/mock-cards-gateway'

describe('MockCardsGateway', () => {
  it('given cards when listed then never expose a full PAN', async () => {
    const cards = await new MockCardsGateway(0).listCards()
    expect(cards.length).toBeGreaterThan(0)
    for (const c of cards) expect(c.last4).toMatch(/^\d{4}$/)
  })

  it('given unknown card id when movements requested then returns empty list', async () => {
    expect(await new MockCardsGateway(0).getMovements('nope')).toEqual([])
  })
})
