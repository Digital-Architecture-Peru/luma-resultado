import { describe, expect, it } from 'vitest'
import { useCards } from '../../src/composables/useCards'
import type { CardQueryPort } from '../../src/services/CardQueryPort'
import type { CardDetail, CardSummary } from '../../src/domain/card'

const summary: CardSummary = { id: 'x1', type: 'CREDIT', brand: 'Visa', last4: '1111', status: 'ACTIVE', holderAlias: 'Test' }
const detail: CardDetail = {
  ...summary,
  creditLimit: 100,
  availableBalance: 60,
  currentBalance: 40,
  cutoffDate: '2026-01-01',
  paymentDueDate: '2026-01-15'
}

function fakePort(overrides: Partial<CardQueryPort> = {}): CardQueryPort {
  return {
    listCards: async () => [summary],
    getCard: async () => detail,
    ...overrides
  }
}

describe('useCards', () => {
  it('given a port with cards when loading then exposes the cards', async () => {
    const c = useCards(fakePort())
    await c.loadCards()
    expect(c.cards.value).toHaveLength(1)
    expect(c.error.value).toBeNull()
    expect(c.empty.value).toBe(false)
    expect(c.loading.value).toBe(false)
  })

  it('given an empty list when loading then empty is true', async () => {
    const c = useCards(fakePort({ listCards: async () => [] }))
    expect(c.empty.value).toBe(false)
    await c.loadCards()
    expect(c.empty.value).toBe(true)
  })

  it('given a failing port when loading then exposes error', async () => {
    const c = useCards(fakePort({ listCards: async () => { throw new Error('boom') } }))
    await c.loadCards()
    expect(c.error.value).toBe('boom')
    expect(c.cards.value).toEqual([])
    expect(c.empty.value).toBe(false)
  })

  it('given a card id when selecting then loads detail', async () => {
    const c = useCards(fakePort())
    await c.selectCard('x1')
    expect(c.selected.value?.availableBalance).toBe(60)
  })

  it('given a failing getCard when selecting then exposes error and clears selection', async () => {
    const c = useCards(fakePort({ getCard: async () => { throw new Error('nf') } }))
    await c.selectCard('zzz')
    expect(c.error.value).toBe('nf')
    expect(c.selected.value).toBeNull()
  })
})
