import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MaskedPan from '../../src/components/atoms/MaskedPan.vue'
import BaseSpinner from '../../src/components/atoms/BaseSpinner.vue'
import CardList from '../../src/components/organisms/CardList.vue'
import ErrorState from '../../src/components/organisms/ErrorState.vue'
import MovementList from '../../src/components/organisms/MovementList.vue'
import CardDetailPanel from '../../src/components/organisms/CardDetailPanel.vue'
import { cardsFixture, movementsFixture } from '../../src/mocks/cards.fixture'

describe('MaskedPan', () => {
  it('never shows more than 4 digits even given a full PAN', () => {
    const w = mount(MaskedPan, { props: { last4: '4111111111114821' } })
    expect(w.text().replace(/\D/g, '')).toBe('4821')
  })
})

describe('BaseSpinner', () => {
  it('exposes role=status', () => {
    expect(mount(BaseSpinner).attributes('role')).toBe('status')
  })
})

describe('CardList', () => {
  it('renders one item per card and emits select', async () => {
    const w = mount(CardList, { props: { cards: cardsFixture } })
    expect(w.findAll('li')).toHaveLength(cardsFixture.length)
    await w.find('button').trigger('click')
    expect(w.emitted('select')?.[0]).toEqual([cardsFixture[0].id])
  })
  it('shows empty state', () => {
    const w = mount(CardList, { props: { cards: [] } })
    expect(w.text()).toContain('No tienes tarjetas')
  })
})

describe('ErrorState', () => {
  it('has role=alert and emits retry', async () => {
    const w = mount(ErrorState, { props: { message: 'fallo' } })
    expect(w.attributes('role')).toBe('alert')
    await w.find('button').trigger('click')
    expect(w.emitted('retry')).toHaveLength(1)
  })
})

describe('MovementList', () => {
  it('shows empty state and items', () => {
    expect(mount(MovementList, { props: { movements: [] } }).text()).toContain('Sin movimientos')
    const w = mount(MovementList, { props: { movements: movementsFixture['c-001'] } })
    expect(w.findAll('li')).toHaveLength(3)
  })
})

describe('CardDetailPanel', () => {
  it('shows credit rows for credit cards and hides them for debit', () => {
    const credit = mount(CardDetailPanel, { props: { card: cardsFixture[0] } })
    expect(credit.text()).toContain('Pago mínimo')
    const debit = mount(CardDetailPanel, { props: { card: cardsFixture[1] } })
    expect(debit.text()).not.toContain('Pago mínimo')
    expect(credit.text()).not.toContain('4111')
  })
})
