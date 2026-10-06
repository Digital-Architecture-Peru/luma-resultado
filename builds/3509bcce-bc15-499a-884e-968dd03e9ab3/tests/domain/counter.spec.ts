import { describe, expect, it } from 'vitest'
import {
  buildConfig,
  clamp,
  decrement,
  increment,
  parseIntOr
} from '../../src/domain/counter'

describe('counter domain', () => {
  const cfg = buildConfig({ initial: 0, step: 2, min: -3, max: 3 })

  it('given step 2 when increment then adds 2', () => {
    expect(increment(0, cfg)).toBe(2)
  })

  it('given value at max when increment then stays at max', () => {
    expect(increment(3, cfg)).toBe(3)
  })

  it('given value at min when decrement then stays at min', () => {
    expect(decrement(-3, cfg)).toBe(-3)
  })

  it('given invalid step when buildConfig then uses default step', () => {
    expect(buildConfig({ step: 0 }).step).toBe(1)
  })

  it('given min greater than max when buildConfig then throws', () => {
    expect(() => buildConfig({ min: 5, max: 1 })).toThrow()
  })

  it('given initial out of range when buildConfig then clamps it', () => {
    expect(buildConfig({ initial: 999 }).initial).toBe(100)
  })

  it('parseIntOr handles empty, invalid and valid values', () => {
    expect(parseIntOr(undefined, 7)).toBe(7)
    expect(parseIntOr('', 7)).toBe(7)
    expect(parseIntOr('abc', 7)).toBe(7)
    expect(parseIntOr('1.5', 7)).toBe(7)
    expect(parseIntOr('4', 7)).toBe(4)
  })

  it('clamp bounds a value', () => {
    expect(clamp(10, 0, 5)).toBe(5)
    expect(clamp(-1, 0, 5)).toBe(0)
  })
})
