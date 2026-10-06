import { describe, expect, it } from 'vitest'
import { formatDate, formatMoney } from '../../src/composables/useFormatters'

describe('formatMoney', () => {
  it('given amount, when formatting en-US USD, then includes symbol and separators', () => {
    expect(formatMoney(1234.5, 'en-US', 'USD')).toBe('$1,234.50')
  })
})

describe('formatDate', () => {
  it('given ISO date, when formatting, then keeps the day regardless of timezone', () => {
    expect(formatDate('2026-10-25', 'en-US')).toContain('25')
  })

  it('given invalid date, when formatting, then returns dash', () => {
    expect(formatDate('no-es-fecha')).toBe('—')
  })
})
