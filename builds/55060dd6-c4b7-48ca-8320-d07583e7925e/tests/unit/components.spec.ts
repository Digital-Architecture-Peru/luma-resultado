import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MaskedPan from '../../src/components/atoms/MaskedPan.vue'
import StatusBadge from '../../src/components/atoms/StatusBadge.vue'
import BalanceRow from '../../src/components/molecules/BalanceRow.vue'
import CardSummaryItem from '../../src/components/molecules/CardSummaryItem.vue'
import CardList from '../../src/components/organisms/CardList.vue'
import { createMockCardAdapter } from '../../src/services/mockCardAdapter'
import type { CardSummary } from '../../src/domain/card'

const card: CardSummary = { id: 'a', type: 'DEBIT', brand: 'Mastercard', last4: '1093', status: 'BLOCKED', holderAlias: 'T' }

describe('atoms', () => {
  it('MaskedPan renders only last 4 digits', () => {
    const w = mount(MaskedPan, { props: { last4: '4821' } })
    expect(w.text().replace(/\D/g, '')).toBe('4821')
  })

  it('StatusBadge renders the Spanish label', () => {
    const w = mount(StatusBadge, { props: { status: 'BLOCKED' } })
    expect(w.text()).toBe('Bloqueada')
    expect(w.classes()).toContain('badge--blocked')
  })
})

describe('molecules', () => {
  it('BalanceRow shows label and amount', () => {
    const w = mount(BalanceRow, { props: { label: 'Disponible', amount: 5 } })
    expect(w.text()).toContain('Disponible')
    expect(w.text()).toContain('5')
  })

  it('CardSummaryItem emits select with the card id on click', async () => {
    const w = mount(CardSummaryItem, { props: { card } })
    await w.get('button').trigger('click')
    expect(w.emitted('select')?.[0]).toEqual(['a'])
  })
})

describe('organisms', () => {
  it('CardList renders one item per card of the mock', async () => {
    const cards = await createMockCardAdapter(0).listCards()
    const w = mount(CardList, { props: { cards } })
    expect(w.findAllComponents(CardSummaryItem)).toHaveLength(cards.length)
  })

  it('CardList re-emits select from an item', async () => {
    const w = mount(CardList, { props: { cards: [card] } })
    await w.get('button').trigger('click')
    expect(w.emitted('select')?.[0]).toEqual(['a'])
  })
})

describe('mock adapter', () => {
  it('never exposes more than 4 digits in last4', async () => {
    const cards = await createMockCardAdapter(0).listCards()
    for (const c of cards) expect(c.last4).toMatch(/^\d{4}$/)
  })

  it('rejects unknown ids', async () => {
    await expect(createMockCardAdapter(0).getCard('nope')).rejects.toThrow()
  })
})
