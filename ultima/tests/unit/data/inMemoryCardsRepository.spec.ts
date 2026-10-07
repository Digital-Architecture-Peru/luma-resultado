import { describe, it, expect } from 'vitest'
import { InMemoryCardsRepository } from '../../../src/data/inMemoryCardsRepository'
import { cardFixtures } from '../../../src/data/fixtures/cards'

describe('InMemoryCardsRepository', () => {
  it('lists all cards', async () => {
    const repo = new InMemoryCardsRepository()
    expect(await repo.list()).toHaveLength(cardFixtures.length)
  })
  it('returns a card by id', async () => {
    const repo = new InMemoryCardsRepository()
    expect((await repo.getById('c-002'))?.type).toBe('debit')
  })
  it('returns null for unknown id', async () => {
    expect(await new InMemoryCardsRepository().getById('zzz')).toBeNull()
  })
  it('returns copies so callers cannot mutate the source', async () => {
    const repo = new InMemoryCardsRepository()
    const list = await repo.list()
    list[0].alias = 'changed'
    expect((await repo.list())[0].alias).not.toBe('changed')
  })
  it('fixtures never contain more than 4 digits of card number', () => {
    for (const c of cardFixtures) expect(c.last4).toMatch(/^\d{4}$/)
  })
})
