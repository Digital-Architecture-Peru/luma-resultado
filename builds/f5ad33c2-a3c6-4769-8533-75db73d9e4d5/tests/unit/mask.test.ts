import { describe, expect, it } from 'vitest'
import { maskPan } from '../../src/domain/mask'

describe('maskPan', () => {
  it('given a full PAN, when masked, then only last 4 digits are visible', () => {
    const out = maskPan('4111 1111 1111 4821')
    expect(out).toBe('•••• 4821')
    expect(out.replace(/\D/g, '').length).toBeLessThanOrEqual(4)
  })
  it('given only last4, when masked, then keeps them', () => {
    expect(maskPan('1234')).toBe('•••• 1234')
  })
  it('given empty or null, when masked, then fully hidden', () => {
    expect(maskPan('')).toBe('•••• ••••')
    expect(maskPan(null)).toBe('•••• ••••')
  })
})
