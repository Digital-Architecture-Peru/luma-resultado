import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CardsConsultaPage from '../../../src/pages/CardsConsultaPage.vue'
import { InMemoryCardsRepository } from '../../../src/data/inMemoryCardsRepository'

describe('CardsConsultaPage', () => {
  it('shows the list and detail of the first card after loading', async () => {
    const w = mount(CardsConsultaPage, { props: { repository: new InMemoryCardsRepository() } })
    await flushPromises()
    expect(w.findAll('li')).toHaveLength(3)
    expect(w.get('#detail-title').text()).toBe('Visa Signature')
  })

  it('changes detail when another card is selected', async () => {
    const w = mount(CardsConsultaPage, { props: { repository: new InMemoryCardsRepository() } })
    await flushPromises()
    await w.findAll('button')[1].trigger('click')
    expect(w.get('#detail-title').text()).toBe('Mastercard Débito')
  })

  it('shows empty message when no cards', async () => {
    const w = mount(CardsConsultaPage, { props: { repository: new InMemoryCardsRepository([]) } })
    await flushPromises()
    expect(w.get('[role="status"]').text()).toContain('No tienes tarjetas')
  })

  it('shows error with retry when repository fails', async () => {
    const repo = { list: async () => { throw new Error('x') }, getById: async () => null }
    const w = mount(CardsConsultaPage, { props: { repository: repo } })
    await flushPromises()
    expect(w.get('[role="alert"]').text()).toContain('No pudimos')
  })

  it('never renders more than 4 consecutive digits of a card number', async () => {
    const w = mount(CardsConsultaPage, { props: { repository: new InMemoryCardsRepository() } })
    await flushPromises()
    expect(w.text()).not.toMatch(/\d{5,}/)
  })
})
