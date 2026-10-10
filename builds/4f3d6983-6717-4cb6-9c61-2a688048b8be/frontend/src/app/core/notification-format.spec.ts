import { describe, expect, it } from 'vitest';
import { formatAmount, typeLabel } from './notification-format';

describe('notification-format', () => {
  it('given each type when typeLabel then returns Spanish label', () => {
    expect(typeLabel('DEPOSIT')).toBe('Depósito');
    expect(typeLabel('WITHDRAWAL')).toBe('Retiro');
    expect(typeLabel('LOW_BALANCE')).toBe('Saldo bajo');
  });

  it('given no amount when formatAmount then returns null', () => {
    expect(formatAmount(null, null)).toBeNull();
    expect(formatAmount(10, null)).toBeNull();
  });

  it('given amount and currency when formatAmount then includes the decimal amount', () => {
    expect(formatAmount(25, 'USD')).toContain('25,00');
  });
});
