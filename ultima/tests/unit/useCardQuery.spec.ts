import { describe, expect, it } from 'vitest'
import { useCardQuery } from '../../src/composables/useCardQuery'
import { InMemoryCardRepository } from '../../src/infrastructure/inMemoryCardRepository'
import type { CardRepository } from '../../src/domain/cardRepository'

describe('useCardQuery', () => {
  it('given cards, when load, then state success and first card selected', async () => {
    const q = useCardQuery(new InMemoryCardRepository())
    expect(q.state.value).toBe('loading')
    await q.load()
    expect(q.state.value).toBe('success')
    expect(q.selected.value?.id).toBe('c-001')
  })

  it('given no cards, when load, then state empty', async () => {
    const q = useCardQuery(new InMemoryCardRepository([]))
    await q.load()
    expect(q.state.value).toBe('empty')
    expect(q.selected.value).toBeNull()
  })

  it('given failing repository, when load, then state error with message', async () => {
    const failing: CardRepository = { listCards: () => Promise.reject(new Error('boom')) }
    const q = useCardQuery(failing)
    await q.load()
    expect(q.state.value).toBe('error')
    expect(q.errorMessage.value).not.toBe('')
  })

  it('given loaded cards, when select existing id, then selected changes; unknown id is ignored', async () => {
    const q = useCardQuery(new InMemoryCardRepository())
    await q.load()
    q.select('c-002')
    expect(q.selected.value?.id).toBe('c-002')
    q.select('nope')
    expect(q.selected.value?.id).toBe('c-002')
  })
})
