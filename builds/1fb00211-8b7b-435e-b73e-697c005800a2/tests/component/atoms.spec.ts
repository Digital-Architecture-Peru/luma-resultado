import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MaskedPan from '../../src/components/atoms/MaskedPan.vue'
import BaseAmount from '../../src/components/atoms/BaseAmount.vue'
import BaseBadge from '../../src/components/atoms/BaseBadge.vue'

describe('atoms', () => {
  it('MaskedPan given last4, then shows masked text and accessible label', () => {
    const w = mount(MaskedPan, { props: { last4: '4821' } })
    expect(w.text()).toBe('•••• 4821')
    expect(w.attributes('aria-label')).toContain('4821')
  })

  it('MaskedPan given invalid input, then hides digits', () => {
    const w = mount(MaskedPan, { props: { last4: '4111111111111111' } })
    expect(w.text()).toBe('••••')
    expect(w.text()).not.toMatch(/\d/)
  })

  it('BaseAmount given explicit locale/currency, then formats', () => {
    const w = mount(BaseAmount, { props: { value: 1500, locale: 'en-US', currency: 'USD' } })
    expect(w.text()).toBe('$1,500.00')
  })

  it('BaseBadge given tone, then applies class', () => {
    const w = mount(BaseBadge, { props: { label: 'Activa', tone: 'success' } })
    expect(w.classes()).toContain('badge--success')
    expect(w.text()).toBe('Activa')
  })
})
