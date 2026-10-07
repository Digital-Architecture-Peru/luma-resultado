import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import TarjetasConsultaPage from '../../src/pages/TarjetasConsultaPage.vue'
import CardList from '../../src/components/organisms/CardList.vue'
import CardDetailPanel from '../../src/components/organisms/CardDetailPanel.vue'
import MovementsTable from '../../src/components/organisms/MovementsTable.vue'
import ConsultaLayout from '../../src/components/templates/ConsultaLayout.vue'
import { MockCardsRepository } from '../../src/infrastructure/mock-cards-repository'
import { fixtureCards, fixtureMovements } from '../../src/infrastructure/fixtures'
import type { CardsRepository } from '../../src/domain/cards-repository'

describe('TarjetasConsultaPage states', () => {
  it('given pending request when mounted then shows loading', () => {
    const never: CardsRepository = {
      listCards: () => new Promise(() => {}),
      listMovements: () => new Promise(() => {}),
    }
    const w = mount(TarjetasConsultaPage, { props: { repository: never } })
    expect(w.text()).toContain('Cargando tarjetas')
  })

  it('given no cards when loaded then shows empty message', async () => {
    const w = mount(TarjetasConsultaPage, { props: { repository: new MockCardsRepository({ cards: [] }) } })
    await flushPromises()
    expect(w.text()).toContain('No tienes tarjetas registradas')
  })

  it('given failure when loaded then shows alert and retry recovers', async () => {
    let fail = true
    const base = new MockCardsRepository()
    const repo: CardsRepository = {
      listCards: () => (fail ? Promise.reject(new Error('caido')) : base.listCards()),
      listMovements: (id, f) => base.listMovements(id, f),
    }
    const w = mount(TarjetasConsultaPage, { props: { repository: repo } })
    await flushPromises()
    expect(w.find('[role="alert"]').text()).toContain('caido')
    fail = false
    await w.find('button.btn').trigger('click')
    await flushPromises()
    expect(w.findAll('button.card-item').length).toBe(fixtureCards.length)
  })

  it('given cards when ready then lists them and selecting shows detail and movements', async () => {
    const w = mount(TarjetasConsultaPage, { props: { repository: new MockCardsRepository() } })
    await flushPromises()
    const items = w.findAll('button.card-item')
    expect(items.length).toBe(3)
    expect(w.text()).toContain('Selecciona una tarjeta')
    await items[0].trigger('click')
    await flushPromises()
    expect(w.text()).toContain('Detalle de tarjeta'.length ? 'Compras diarias' : '')
    expect(w.find('table').exists()).toBe(true)
    expect(w.findAll('tbody tr').length).toBe(4)
    expect(items[0].attributes('aria-pressed')).toBe('true')
  })
})

describe('organisms and template', () => {
  it('CardList emits select with card id', async () => {
    const w = mount(CardList, { props: { cards: fixtureCards, selectedId: null } })
    await w.findAll('button.card-item')[1].trigger('click')
    expect(w.emitted('select')?.[0]).toEqual(['c2'])
  })

  it('CardDetailPanel shows credit limit only for cards that have one', () => {
    const credit = mount(CardDetailPanel, { props: { card: fixtureCards[0] } })
    const debit = mount(CardDetailPanel, { props: { card: fixtureCards[1] } })
    expect(credit.text()).toContain('Limite de credito')
    expect(debit.text()).not.toContain('Limite de credito')
  })

  it('MovementsTable renders accessible table, and empty and error states', () => {
    const ok = mount(MovementsTable, { props: { movements: fixtureMovements.slice(0, 2), status: 'ready' } })
    expect(ok.find('caption').exists()).toBe(true)
    expect(ok.findAll('th[scope="col"]').length).toBe(4)
    const empty = mount(MovementsTable, { props: { movements: [], status: 'ready' } })
    expect(empty.text()).toContain('No hay movimientos')
    const err = mount(MovementsTable, { props: { movements: [], status: 'error', errorMessage: 'x' } })
    expect(err.find('[role="alert"]').exists()).toBe(true)
    expect(err.attributes('aria-live')).toBe('polite')
  })

  it('ConsultaLayout renders title and slots', () => {
    const w = mount(ConsultaLayout, {
      props: { title: 'Titulo' },
      slots: { list: '<p>L</p>', detail: '<p>D</p>' },
    })
    expect(w.find('h1').text()).toBe('Titulo')
    expect(w.text()).toContain('L')
    expect(w.text()).toContain('D')
  })
})
