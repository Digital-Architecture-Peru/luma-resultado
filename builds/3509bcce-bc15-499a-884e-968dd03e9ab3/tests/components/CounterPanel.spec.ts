import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CounterPanel from '../../src/components/CounterPanel.vue'

describe('CounterPanel', () => {
  it('shows 0 initially in a status region', () => {
    const w = mount(CounterPanel)
    const value = w.get('[data-testid="value"]')
    expect(value.text()).toBe('0')
    expect(value.attributes('role')).toBe('status')
  })

  it('increments on one click', async () => {
    const w = mount(CounterPanel)
    await w.get('[data-testid="inc"]').trigger('click')
    expect(w.get('[data-testid="value"]').text()).toBe('1')
  })

  it('decrements on click', async () => {
    const w = mount(CounterPanel)
    await w.get('[data-testid="dec"]').trigger('click')
    expect(w.get('[data-testid="value"]').text()).toBe('-1')
  })

  it('reset restores the initial value', async () => {
    const w = mount(CounterPanel, { props: { config: { initial: 4 } } })
    await w.get('[data-testid="inc"]').trigger('click')
    await w.get('[data-testid="reset"]').trigger('click')
    expect(w.get('[data-testid="value"]').text()).toBe('4')
  })

  it('disables increment at max', () => {
    const w = mount(CounterPanel, { props: { config: { initial: 2, min: 0, max: 2 } } })
    expect(w.get('[data-testid="inc"]').attributes('disabled')).toBeDefined()
  })
})
