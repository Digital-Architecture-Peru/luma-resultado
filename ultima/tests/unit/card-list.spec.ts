import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CardList from '../../src/components/organisms/CardList.vue'
import type { Card } from '../../src/domain/card'

const card = (id: string, alias: string): Card => ({
  id,
  alias,
  brand: 'Visa',
  last4: '1234',
  holderName: 'TEST',
  status: 'ACTIVE',
  currency: 'USD',
  creditLimit: 100,
  availableBalance: 50,
  expiry: '01/30',
})

describe('CardList', () => {
  it('given no cards when rendered then shows empty message', () => {
    const w = mount(CardList, { props: { cards: [], selectedId: null } })
    expect(w.text()).toContain('No tienes tarjetas')
  })

  it('given cards when rendered then lists each alias', () => {
    const w = mount(CardList, { props: { cards: [card('a', 'Uno'), card('b', 'Dos')], selectedId: 'a' } })
    expect(w.text()).toContain('Uno')
    expect(w.text()).toContain('Dos')
    expect(w.findAll('button')[0].attributes('aria-pressed')).toBe('true')
  })

  it('given a click on an item then emits select with its id', async () => {
    const w = mount(CardList, { props: { cards: [card('a', 'Uno'), card('b', 'Dos')], selectedId: 'a' } })
    await w.findAll('button')[1].trigger('click')
    expect(w.emitted('select')?.[0]).toEqual(['b'])
  })
})
