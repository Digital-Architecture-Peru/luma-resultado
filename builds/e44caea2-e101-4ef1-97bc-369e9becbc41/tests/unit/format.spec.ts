import { describe, expect, it } from 'vitest';
import { formatDate, formatMoney, lastDigits, maskAccountNumber } from '../../src/domain/format';
import { isAccountTypeOption } from '../../src/domain/account';

describe('maskAccountNumber', () => {
  it('given a full number, when masked, then only the last 4 digits remain', () => {
    const masked = maskAccountNumber('0001234567891234');
    expect(masked).toBe('•••• 1234');
    expect(masked).not.toContain('0001234567891234');
  });

  it('given separators, when masked, then they are ignored', () => {
    expect(maskAccountNumber('0001-2345 6789')).toBe('•••• 6789');
  });

  it('given a number shorter than 4 chars, when masked, then no digits leak', () => {
    expect(maskAccountNumber('12')).toBe('••••');
    expect(lastDigits('12')).toBe('');
  });
});

describe('formatMoney', () => {
  it('given minor units in USD, when formatted, then it shows major units with 2 decimals', () => {
    const text = formatMoney(123456, 'USD', 'en-US');
    expect(text).toContain('1,234.56');
    expect(text).toContain('$');
  });

  it('given a negative amount, when formatted, then the sign is present', () => {
    expect(formatMoney(-15000, 'USD', 'en-US')).toContain('-');
  });

  it('given a zero-decimal currency, when formatted, then no division by 100 happens', () => {
    expect(formatMoney(5000, 'JPY', 'en-US')).toContain('5,000');
  });

  it('given a non-integer amount, when formatted, then it throws RangeError', () => {
    expect(() => formatMoney(10.5, 'USD')).toThrow(RangeError);
  });

  it('given an invalid currency code, when formatted, then it throws RangeError', () => {
    expect(() => formatMoney(100, 'NOPE')).toThrow(RangeError);
  });
});

describe('formatDate', () => {
  it('given an ISO date, when formatted, then it keeps the calendar day (UTC)', () => {
    const text = formatDate('2020-01-15', 'en-US');
    expect(text).toContain('2020');
    expect(text).toContain('15');
  });

  it('given an invalid date, when formatted, then it throws RangeError', () => {
    expect(() => formatDate('no-es-fecha')).toThrow(RangeError);
  });
});

describe('isAccountTypeOption', () => {
  it('accepts known options and rejects unknown values', () => {
    expect(isAccountTypeOption('ALL')).toBe(true);
    expect(isAccountTypeOption('SAVINGS')).toBe(true);
    expect(isAccountTypeOption('LOAN')).toBe(false);
    expect(isAccountTypeOption(undefined)).toBe(false);
  });
});
