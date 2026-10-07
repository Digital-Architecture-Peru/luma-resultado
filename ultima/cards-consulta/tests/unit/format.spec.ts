import { describe, expect, it } from 'vitest';
import { formatMoney, maskCardNumber, statusLabel } from '../../src/domain/format';

describe('maskCardNumber', () => {
  it('given 4 digits when masking then shows only last4', () => {
    expect(maskCardNumber('1234')).toBe('•••• 1234');
  });

  it('given a full PAN when masking then does not leak it', () => {
    const out = maskCardNumber('4111111111111111');
    expect(out).toBe('•••• ····');
    expect(out).not.toContain('4111');
  });
});

describe('formatMoney', () => {
  it('given amount and currency when formatting then includes the amount digits', () => {
    expect(formatMoney(1234.5, 'USD')).toMatch(/1\D?234[.,]50/);
  });

  it('given an invalid currency when formatting then falls back without throwing', () => {
    expect(formatMoney(10, 'XX')).toBe('10.00 XX');
  });
});

describe('statusLabel', () => {
  it('maps statuses to Spanish labels', () => {
    expect(statusLabel('ACTIVE')).toBe('Activa');
    expect(statusLabel('BLOCKED')).toBe('Bloqueada');
    expect(statusLabel('EXPIRED')).toBe('Vencida');
  });
});
