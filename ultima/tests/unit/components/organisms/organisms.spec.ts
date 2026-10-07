import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CardList from '../../../../src/components/organisms/CardList.vue'
import CardDetailPanel from '../../../../src/components/organisms/CardDetailPanel.vue'
import { cardFixtures } from '../../../../src/data/fixtures/cards'

describe('organisms', () => {
  it('CardList renders one item per card and relays select', async () => {
    const w = mount(CardList, { props: { cards: cardFixtures, selectedId: 'c-001' } })
    expect(w.findAll('li')).toHaveLength(cardFixtures.length)
    await w.findAll('button')[1].trigger('click')
    expect(w.emitted('select')?.[0]).toEqual(['c-002'])
  })

  it('CardDetailPanel shows credit details and usage', () => {
    const w = mount(CardDetailPanel, { props: { card: cardFixtures[0] } })
    expect(w.text()).toContain('Línea de crédito')
    expect(w.text()).toContain('Fecha de corte')
    expect(w.find('[role="progressbar"]').exists()).toBe(true)
  })

  it('CardDetailPanel hides credit-only fields for debit cards', () => {
    const w = mount(CardDetailPanel, { props: { card: cardFixtures[1] } })
    expect(w.text()).not.toContain('Línea de crédito')
    expect(w.text()).not.toContain('Fecha de pago')
    expect(w.find('[role="progressbar"]').exists()).toBe(false)
  })
})
