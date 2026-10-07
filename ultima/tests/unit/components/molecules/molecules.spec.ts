import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CardSummaryItem from '../../../../src/components/molecules/CardSummaryItem.vue'
import BalanceRow from '../../../../src/components/molecules/BalanceRow.vue'
import StatusMessage from '../../../../src/components/molecules/StatusMessage.vue'
import { cardFixtures } from '../../../../src/data/fixtures/cards'

describe('molecules', () => {
  it('CardSummaryItem emits select with the card id on click', async () => {
    const w = mount(CardSummaryItem, { props: { card: cardFixtures[0], selected: false } })
    await w.get('button').trigger('click')
    expect(w.emitted('select')?.[0]).toEqual(['c-001'])
  })

  it('CardSummaryItem shows blocked status and aria-pressed', () => {
    const w = mount(CardSummaryItem, { props: { card: cardFixtures[2], selected: true } })
    expect(w.text()).toContain('Bloqueada')
    expect(w.get('button').attributes('aria-pressed')).toBe('true')
  })

  it('BalanceRow renders label and text fallback', () => {
    const w = mount(BalanceRow, { props: { label: 'Fecha de corte', text: '20 oct 2026' } })
    expect(w.text()).toContain('Fecha de corte')
    expect(w.text()).toContain('20 oct 2026')
  })

  it('StatusMessage error uses alert role and emits retry', async () => {
    const w = mount(StatusMessage, { props: { kind: 'error', message: 'Falló' } })
    expect(w.attributes('role')).toBe('alert')
    await w.get('button').trigger('click')
    expect(w.emitted('retry')).toHaveLength(1)
  })

  it('StatusMessage loading uses status role', () => {
    const w = mount(StatusMessage, { props: { kind: 'loading', message: 'Cargando' } })
    expect(w.attributes('role')).toBe('status')
  })
})
