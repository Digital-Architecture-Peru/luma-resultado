import { describe, expect, it } from 'vitest'
import { formatDate, formatMoney, maskPan } from '../../src/utils/format'

describe('maskPan', () => {
  it('given last4 when masking then shows only 4 digits', () => {
    const out = maskPan('4821')
    expect(out.replace(/\D/g, '')).toBe('4821')
    expect(out.endsWith('4821')).toBe(true)
  })

  it('given a full PAN when masking then never shows more than 4 digits', () => {
    const out = maskPan('4111111111111234')
    expect(out.replace(/\D/g, '')).toBe('1234')
  })

  it('given empty input when masking then shows no digits', () => {
    expect(maskPan('').replace(/\D/g, '')).toBe('')
  })
})

describe('formatMoney', () => {
  it('given an amount when formatting then includes the digits', () => {
    expect(formatMoney(1250, 'USD', 'en-US')).toBe('$1,250.00')
  })

  it('given invalid currency when formatting then falls back to fixed decimals', () => {
    expect(formatMoney(10, 'INVALID_CODE', 'en-US')).toBe('10.00')
  })
})

describe('formatDate', () => {
  it('given a non ISO string then returns it unchanged', () => {
    expect(formatDate('abc')).toBe('abc')
  })

  it('given an ISO date then returns a non-empty localized string with the year', () => {
    expect(formatDate('2026-10-20', 'en-US')).toContain('2026')
  })
})
