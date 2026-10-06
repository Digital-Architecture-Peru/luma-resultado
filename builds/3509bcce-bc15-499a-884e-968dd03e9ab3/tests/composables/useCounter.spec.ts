import { describe, expect, it } from 'vitest'
import { useCounter } from '../../src/composables/useCounter'

describe('useCounter', () => {
  it('starts at the initial value', () => {
    const c = useCounter({ initial: 5 })
    expect(c.count.value).toBe(5)
  })

  it('increments and decrements', () => {
    const c = useCounter()
    c.increment()
    c.increment()
    c.decrement()
    expect(c.count.value).toBe(1)
  })

  it('reset returns to initial', () => {
    const c = useCounter({ initial: 2 })
    c.increment()
    c.reset()
    expect(c.count.value).toBe(2)
  })

  it('canIncrement is false at max', () => {
    const c = useCounter({ initial: 3, min: 0, max: 3 })
    expect(c.canIncrement.value).toBe(false)
    expect(c.canDecrement.value).toBe(true)
  })
})
