import { formatAmount, formatDate } from './format';
import { describe, expect, it } from 'vitest';

describe('format', () => {
  it('given decimal string and currency when formatAmount then keeps exact digits', () => {
    expect(formatAmount('120.50', 'USD')).toBe('120.50 USD');
  });

  it('given null date when formatDate then shows placeholder', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('given ISO instant when formatDate then shows UTC date and time', () => {
    expect(formatDate('2026-09-01T10:15:00Z')).toBe('2026-09-01 10:15 UTC');
  });
});
