import { describe, expect, it } from 'vitest'
import { formatMoney, formatDate } from '../../src/composables/useMoneyFormat'

describe('formatMoney', () => {
  it('given amount and currency when formatting then includes the digits', () => {
    expect(formatMoney(1234.5, 'USD', 'en-US')).toBe('$1,234.50')
  })

  it('given invalid currency when formatting then falls back without throwing', () => {
    expect(formatMoney(10, 'no', 'en-US')).toBe('10.00 no')
  })
})

describe('formatDate', () => {
  it('given invalid date when formatting then returns the original text', () => {
    expect(formatDate('no-es-fecha')).toBe('no-es-fecha')
  })
})
