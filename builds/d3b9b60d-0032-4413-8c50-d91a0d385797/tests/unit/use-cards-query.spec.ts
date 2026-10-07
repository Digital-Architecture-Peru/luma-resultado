import { describe, it, expect } from 'vitest'
import { useCardsQuery } from '../../src/composables/useCardsQuery'
import { MockCardsGateway } from '../../src/services/mock-cards-gateway'
import type { CardsGateway } from '../../src/services/cards-gateway'

describe('useCardsQuery', () => {
  it('given gateway ok when load then selects first card and loads its movements', async () => {
    const q = useCardsQuery(new MockCardsGateway(0))
    await q.load()
    expect(q.cards.value.length).toBeGreaterThan(0)
    expect(q.selectedCard.value?.id).toBe(q.cards.value[0].id)
    expect(q.movements.value.every((m) => m.cardId === q.selectedId.value)).toBe(true)
    expect(q.loading.value).toBe(false)
    expect(q.error.value).toBeNull()
  })

  it('given select another card then movements change', async () => {
    const q = useCardsQuery(new MockCardsGateway(0))
    await q.load()
    await q.select('c-002')
    expect(q.selectedCard.value?.id).toBe('c-002')
    expect(q.movements.value.map((m) => m.cardId)).toEqual(['c-002'])
  })

  it('given listCards fails when load then exposes error and no data', async () => {
    const failing: CardsGateway = {
      listCards: () => Promise.reject(new Error('boom')),
      getMovements: () => Promise.resolve([]),
    }
    const q = useCardsQuery(failing)
    await q.load()
    expect(q.error.value).toContain('tarjetas')
    expect(q.cards.value).toEqual([])
    expect(q.loading.value).toBe(false)
  })

  it('given getMovements fails when select then exposes error and clears movements', async () => {
    const gw: CardsGateway = {
      listCards: () => new MockCardsGateway(0).listCards(),
      getMovements: () => Promise.reject(new Error('boom')),
    }
    const q = useCardsQuery(gw)
    await q.load()
    expect(q.error.value).toContain('movimientos')
    expect(q.movements.value).toEqual([])
  })
})
