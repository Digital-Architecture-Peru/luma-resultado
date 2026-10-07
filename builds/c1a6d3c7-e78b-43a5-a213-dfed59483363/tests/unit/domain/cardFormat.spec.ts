import { describe, it, expect } from 'vitest'
import { maskCard, formatMoney, formatDate, utilization } from '../../../src/domain/cardFormat'
import { cardFixtures } from '../../../src/data/fixtures/cards'

describe('maskCard', () => {
  it('given 4 digits, when masked, then only those 4 digits are visible', () => {
    expect(maskCard('4821')).toBe('•••• •••• •••• 4821')
  })
  it('given a full PAN, when masked, then only last 4 digits are visible', () => {
    const out = maskCard('4111111111114821')
    expect(out.replace(/\D/g, '')).toBe('4821')
  })
  it('given empty input, when masked, then no digits are visible', () => {
    expect(maskCard('').replace(/\D/g, '')).toBe('')
  })
})

describe('formatters', () => {
  it('formats money with currency', () => {
    expect(formatMoney(1500, 'PEN', 'es-PE')).toContain('1')
    expect(formatMoney(1500, 'PEN', 'es-PE')).toMatch(/500/)
  })
  it('returns dash for missing or invalid dates', () => {
    expect(formatDate(undefined, 'es-PE')).toBe('—')
    expect(formatDate('no-date', 'es-PE')).toBe('—')
  })
  it('formats a valid date including its year', () => {
    expect(formatDate('2026-10-20', 'es-PE')).toContain('2026')
  })
})

describe('utilization', () => {
  it('computes percentage for credit cards', () => {
    expect(utilization(cardFixtures[0])).toBe(35)
  })
  it('returns null for debit cards', () => {
    expect(utilization(cardFixtures[1])).toBeNull()
  })
  it('caps at 100 for a fully used line', () => {
    expect(utilization(cardFixtures[2])).toBe(100)
  })
})
