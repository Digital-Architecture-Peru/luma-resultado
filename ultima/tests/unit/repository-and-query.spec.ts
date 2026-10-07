import { describe, expect, it } from 'vitest'
import { MockCardsRepository } from '../../src/infrastructure/mock-cards-repository'
import { createCardsRepository } from '../../src/infrastructure/repository-factory'
import { useCardsQuery } from '../../src/composables/useCardsQuery'

describe('MockCardsRepository', () => {
  it('given repository when listing cards then returns fixtures', async () => {
    const cards = await new MockCardsRepository().listCards()
    expect(cards.length).toBeGreaterThan(0)
    expect(cards.every((c) => /^\d{4}$/.test(c.last4))).toBe(true)
  })

  it('given card when listing movements then only that card, newest first', async () => {
    const m = await new MockCardsRepository().listMovements('c1')
    expect(m.every((x) => x.cardId === 'c1')).toBe(true)
    expect(m.map((x) => x.date)).toEqual([...m.map((x) => x.date)].sort().reverse())
  })

  it('given date range when listing then filters inclusively', async () => {
    const m = await new MockCardsRepository().listMovements('c1', { from: '2026-09-15', to: '2026-09-28' })
    expect(m.map((x) => x.id).sort()).toEqual(['m2', 'm3'])
  })

  it('given inverted range when listing then rejects', async () => {
    await expect(new MockCardsRepository().listMovements('c1', { from: '2026-10-01', to: '2026-09-01' })).rejects.toThrow()
  })

  it('given malformed date when listing then rejects', async () => {
    await expect(new MockCardsRepository().listMovements('c1', { from: 'hoy' })).rejects.toThrow('Formato')
  })
})

describe('createCardsRepository', () => {
  it('given mock source then returns repository', () => {
    expect(createCardsRepository('mock')).toBeDefined()
  })

  it('given unsupported source then throws', () => {
    expect(() => createCardsRepository('http')).toThrow()
  })
})

describe('useCardsQuery', () => {
  it('given cards when load then status ready', async () => {
    const q = useCardsQuery(new MockCardsRepository())
    expect(q.status.value).toBe('loading')
    await q.load()
    expect(q.status.value).toBe('ready')
  })

  it('given no cards when load then status empty', async () => {
    const q = useCardsQuery(new MockCardsRepository({ cards: [] }))
    await q.load()
    expect(q.status.value).toBe('empty')
  })

  it('given failing repo when load then status error with message', async () => {
    const q = useCardsQuery(new MockCardsRepository({ failWith: 'fallo' }))
    await q.load()
    expect(q.status.value).toBe('error')
    expect(q.errorMessage.value).toBe('fallo')
  })

  it('given loaded cards when select then loads movements; filter narrows them', async () => {
    const q = useCardsQuery(new MockCardsRepository())
    await q.load()
    await q.select('c1')
    expect(q.selectedCard.value?.id).toBe('c1')
    expect(q.movements.value.length).toBe(4)
    await q.applyFilter({ from: '2026-10-01' })
    expect(q.movements.value.map((m) => m.id)).toEqual(['m4'])
  })

  it('given unknown id when select then ignores it', async () => {
    const q = useCardsQuery(new MockCardsRepository())
    await q.load()
    await q.select('zzz')
    expect(q.selectedId.value).toBeNull()
  })

  it('given invalid filter when applying then movementsStatus is error', async () => {
    const q = useCardsQuery(new MockCardsRepository())
    await q.load()
    await q.select('c1')
    await q.applyFilter({ from: '2026-10-02', to: '2026-10-01' })
    expect(q.movementsStatus.value).toBe('error')
  })
})
