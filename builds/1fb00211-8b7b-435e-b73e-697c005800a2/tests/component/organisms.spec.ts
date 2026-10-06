import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CardList from '../../src/components/organisms/CardList.vue'
import CardDetailPanel from '../../src/components/organisms/CardDetailPanel.vue'
import StatusMessage from '../../src/components/molecules/StatusMessage.vue'
import { fixtureCards } from '../../src/infrastructure/fixtures/cards'

describe('organisms', () => {
  it('CardList given cards, then renders one button per card and emits select', async () => {
    const w = mount(CardList, { props: { cards: fixtureCards, selectedId: 'c-001' } })
    const buttons = w.findAll('button')
    expect(buttons).toHaveLength(fixtureCards.length)
    expect(buttons[0].attributes('aria-pressed')).toBe('true')
    await buttons[1].trigger('click')
    expect(w.emitted('select')?.[0]).toEqual(['c-002'])
  })

  it('CardDetailPanel given credit card, then shows credit fields', () => {
    const w = mount(CardDetailPanel, { props: { card: fixtureCards[0] } })
    expect(w.text()).toContain('Línea de crédito')
    expect(w.text()).toContain('Fecha de pago')
  })

  it('CardDetailPanel given debit card, then hides credit fields', () => {
    const w = mount(CardDetailPanel, { props: { card: fixtureCards[1] } })
    expect(w.text()).toContain('Saldo disponible')
    expect(w.text()).not.toContain('Línea de crédito')
  })

  it('CardDetailPanel given null, then shows prompt', () => {
    const w = mount(CardDetailPanel, { props: { card: null } })
    expect(w.text()).toContain('Selecciona una tarjeta')
  })

  it('StatusMessage given error, then role alert and emits retry', async () => {
    const w = mount(StatusMessage, { props: { state: 'error', message: 'Falló' } })
    expect(w.attributes('role')).toBe('alert')
    await w.find('button').trigger('click')
    expect(w.emitted('retry')).toHaveLength(1)
  })

  it('StatusMessage given loading/empty, then role status', () => {
    expect(mount(StatusMessage, { props: { state: 'loading' } }).attributes('role')).toBe('status')
    expect(mount(StatusMessage, { props: { state: 'empty' } }).attributes('role')).toBe('status')
  })
})
