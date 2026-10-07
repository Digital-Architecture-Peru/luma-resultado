import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MaskedPan from '../../src/components/atoms/MaskedPan.vue'
import StatusBadge from '../../src/components/atoms/StatusBadge.vue'
import MoneyText from '../../src/components/atoms/MoneyText.vue'
import DateRangeFilter from '../../src/components/molecules/DateRangeFilter.vue'

describe('atoms', () => {
  it('given last4 when rendering then shows masked number and accessible label', () => {
    const w = mount(MaskedPan, { props: { last4: '1234' } })
    expect(w.text()).toBe('•••• 1234')
    expect(w.attributes('aria-label')).toBe('Tarjeta terminada en 1234')
  })

  it('given malformed last4 when rendering then does not leak the value', () => {
    const w = mount(MaskedPan, { props: { last4: '12345678' } })
    expect(w.text()).toBe('•••• ----')
  })

  it('given status when rendering then uses text and class', () => {
    const w = mount(StatusBadge, { props: { status: 'bloqueada' } })
    expect(w.text()).toBe('bloqueada')
    expect(w.classes()).toContain('badge--bloqueada')
  })

  it('given amount when rendering MoneyText then formats with locale', () => {
    const w = mount(MoneyText, { props: { amount: 5, currency: 'USD', locale: 'en-US' } })
    expect(w.text()).toBe('$5.00')
  })
})

describe('DateRangeFilter', () => {
  it('given valid range when submitting then emits apply with range', async () => {
    const w = mount(DateRangeFilter)
    await w.find('input[name="from"]').setValue('2026-09-01')
    await w.find('input[name="to"]').setValue('2026-09-30')
    await w.find('form').trigger('submit')
    expect(w.emitted('apply')?.[0]).toEqual([{ from: '2026-09-01', to: '2026-09-30' }])
  })

  it('given inverted range when submitting then shows alert and does not emit', async () => {
    const w = mount(DateRangeFilter)
    await w.find('input[name="from"]').setValue('2026-09-30')
    await w.find('input[name="to"]').setValue('2026-09-01')
    await w.find('form').trigger('submit')
    expect(w.find('[role="alert"]').exists()).toBe(true)
    expect(w.emitted('apply')).toBeUndefined()
  })
})
