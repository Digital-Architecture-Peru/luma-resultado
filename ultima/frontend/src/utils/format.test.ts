import { describe, expect, it } from 'vitest';
import { formatAmount, formatDate } from './format';

describe('format', () => {
  it('given large amount when formatting then groups thousands keeping decimals', () => {
    expect(formatAmount('1234567.80', 'USD')).toBe('1,234,567.80 USD');
  });

  it('given small amount when formatting then no separator', () => {
    expect(formatAmount('100.00', 'USD')).toBe('100.00 USD');
  });

  it('given iso timestamp when formatting date then returns yyyy-mm-dd', () => {
    expect(formatDate('2026-09-01T10:00:00+00:00')).toBe('2026-09-01');
  });
});
