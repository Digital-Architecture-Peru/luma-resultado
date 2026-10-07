import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MaskedPan from '../../src/components/atoms/MaskedPan.vue'
import BaseBadge from '../../src/components/atoms/BaseBadge.vue'
import AmountText from '../../src/components/atoms/AmountText.vue'

describe('MaskedPan', () => {
  it('given last4 when rendered then shows masked pan', () => {
    const w = mount(MaskedPan, { props: { last4: '4821' } })
    expect(w.text()).toBe('**** 4821')
  })

  it('given a longer value when rendered then only last 4 digits are shown', () => {
    const w = mount(MaskedPan, { props: { last4: '4111111111114821' } })
    expect(w.text()).toBe('**** 4821')
    expect(w.text()).not.toContain('4111')
  })
})

describe('BaseBadge', () => {
  it('given BLOCKED when rendered then shows text label, not only color', () => {
    const w = mount(BaseBadge, { props: { status: 'BLOCKED' } })
    expect(w.text()).toContain('Bloqueada')
  })

  it('given ACTIVE when rendered then shows Activa', () => {
    const w = mount(BaseBadge, { props: { status: 'ACTIVE' } })
    expect(w.text()).toContain('Activa')
  })
})

describe('AmountText', () => {
  it('given negative amount when rendered then applies negative class and currency', () => {
    const w = mount(AmountText, { props: { amount: -10, currency: 'USD' } })
    expect(w.classes()).toContain('amount--neg')
    expect(w.text()).toMatch(/10/)
  })
})
