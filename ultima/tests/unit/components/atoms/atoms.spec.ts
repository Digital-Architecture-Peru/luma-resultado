import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseBadge from '../../../../src/components/atoms/BaseBadge.vue'
import MoneyAmount from '../../../../src/components/atoms/MoneyAmount.vue'
import MaskedCardNumber from '../../../../src/components/atoms/MaskedCardNumber.vue'
import ProgressBar from '../../../../src/components/atoms/ProgressBar.vue'

describe('atoms', () => {
  it('BaseBadge renders label with tone class', () => {
    const w = mount(BaseBadge, { props: { label: 'Activa', tone: 'success' } })
    expect(w.text()).toBe('Activa')
    expect(w.classes()).toContain('badge--success')
  })

  it('MoneyAmount renders a formatted amount', () => {
    const w = mount(MoneyAmount, { props: { amount: 1234.5, currency: 'PEN', locale: 'es-PE' } })
    expect(w.text()).toMatch(/1.?234/)
  })

  it('MaskedCardNumber shows only 4 digits', () => {
    const w = mount(MaskedCardNumber, { props: { last4: '4111111111114821' } })
    expect(w.text().replace(/\D/g, '')).toBe('4821')
  })

  it('ProgressBar exposes progressbar role and clamps value', () => {
    const w = mount(ProgressBar, { props: { value: 150, label: 'Uso' } })
    expect(w.attributes('role')).toBe('progressbar')
    expect(w.attributes('aria-valuenow')).toBe('100')
  })
})
