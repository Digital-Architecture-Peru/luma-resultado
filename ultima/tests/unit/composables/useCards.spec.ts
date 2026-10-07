import { describe, it, expect } from 'vitest'
import { useCards } from '../../../src/composables/useCards'
import { InMemoryCardsRepository } from '../../../src/data/inMemoryCardsRepository'
import type { CardsRepository } from '../../../src/data/CardsRepository'

describe('useCards', () => {
  it('starts idle, then is loading while pending', async () => {
    const repo: CardsRepository = {
      list: () => new Promise(() => {}),
      getById: async () => null
    }
    const c = useCards(repo)
    expect(c.status.value).toBe('idle')
    void c.load()
    expect(c.status.value).toBe('loading')
  })

  it('reaches success and selects the first card', async () => {
    const c = useCards(new InMemoryCardsRepository())
    await c.load()
    expect(c.status.value).toBe('success')
    expect(c.selected.value?.id).toBe('c-001')
  })

  it('reaches empty when there are no cards', async () => {
    const c = useCards(new InMemoryCardsRepository([]))
    await c.load()
    expect(c.status.value).toBe('empty')
    expect(c.selected.value).toBeNull()
  })

  it('reaches error when the repository fails', async () => {
    const c = useCards({
      list: async () => { throw new Error('boom') },
      getById: async () => null
    })
    await c.load()
    expect(c.status.value).toBe('error')
    expect(c.errorMessage.value).not.toBe('')
  })

  it('select changes the selected card and ignores unknown ids', async () => {
    const c = useCards(new InMemoryCardsRepository())
    await c.load()
    c.select('c-002')
    expect(c.selected.value?.id).toBe('c-002')
    c.select('nope')
    expect(c.selected.value?.id).toBe('c-002')
  })
})
