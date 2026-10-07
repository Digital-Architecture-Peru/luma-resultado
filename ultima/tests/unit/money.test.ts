import { describe, expect, it } from 'vitest'
import { formatDate, formatMoney } from '../../src/domain/money'

describe('formatMoney', () => {
  it('formats a valid amount with two decimals', () => {
    expect(formatMoney(1234.5, 'USD', 'en')).toBe('$1,234.50')
  })
  it('returns a dash for non-finite values', () => {
    expect(formatMoney(NaN, 'USD')).toBe('—')
  })
  it('falls back on invalid currency code', () => {
    expect(formatMoney(10, 'XX', 'en')).toBe('10.00 XX')
  })
})

describe('formatDate', () => {
  it('formats ISO date', () => {
    expect(formatDate('2026-10-20', 'en')).toContain('2026')
  })
  it('returns a dash for invalid date', () => {
    expect(formatDate('nope')).toBe('—')
  })
})
