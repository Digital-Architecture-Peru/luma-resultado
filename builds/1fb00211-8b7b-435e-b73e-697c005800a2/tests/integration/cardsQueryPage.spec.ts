import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import CardsQueryPage from '../../src/pages/CardsQueryPage.vue'
import { cardRepositoryKey } from '../../src/composables/repositoryKey'
import { InMemoryCardRepository } from '../../src/infrastructure/inMemoryCardRepository'
import type { CardRepository } from '../../src/domain/cardRepository'

function mountPage(repo: CardRepository) {
  return mount(CardsQueryPage, { global: { provide: { [cardRepositoryKey as symbol]: repo } } })
}

describe('CardsQueryPage', () => {
  it('given loading, then shows status message first', () => {
    const w = mountPage(new InMemoryCardRepository())
    expect(w.find('[role="status"]').exists()).toBe(true)
  })

  it('given cards, when loaded, then lists them and shows detail; selecting changes detail', async () => {
    const w = mountPage(new InMemoryCardRepository())
    await flushPromises()
    expect(w.findAll('ul button')).toHaveLength(3)
    expect(w.text()).toContain('Línea de crédito')
    await w.findAll('ul button')[1].trigger('click')
    expect(w.text()).not.toContain('Línea de crédito')
  })

  it('given empty repository, then shows empty message', async () => {
    const w = mountPage(new InMemoryCardRepository([]))
    await flushPromises()
    expect(w.text()).toContain('No tienes tarjetas')
  })

  it('given failing repository, then shows alert and retry recovers', async () => {
    let fail = true
    const repo: CardRepository = {
      listCards: () => (fail ? Promise.reject(new Error('x')) : new InMemoryCardRepository().listCards())
    }
    const w = mountPage(repo)
    await flushPromises()
    expect(w.find('[role="alert"]').exists()).toBe(true)
    fail = false
    await w.find('[role="alert"] button').trigger('click')
    await flushPromises()
    expect(w.findAll('ul button')).toHaveLength(3)
  })

  it('given rendered page, then no run of more than 4 consecutive digits appears (PAN safety)', async () => {
    const w = mountPage(new InMemoryCardRepository())
    await flushPromises()
    expect(w.text()).not.toMatch(/\d{5,}/)
  })
})
