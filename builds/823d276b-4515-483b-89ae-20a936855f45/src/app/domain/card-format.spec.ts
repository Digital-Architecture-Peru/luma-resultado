import { describe, expect, it } from 'vitest';
import { creditUsagePercent, formatMoney, maskCardNumber, statusLabel, typeLabel } from './card-format';
import { Card } from './card.model';

const credit: Card = {
  id: 'x',
  holder: 'Test',
  last4: '1234',
  brand: 'Visa',
  type: 'credit',
  status: 'active',
  expiry: '01/30',
  currency: 'PEN',
  availableBalance: 2000,
  creditLimit: 8000,
};

describe('card-format', () => {
  it('given last4 when masking then only the last four digits are visible', () => {
    expect(maskCardNumber('1234')).toBe('•••• •••• •••• 1234');
  });

  it('given an invalid last4 when masking then it throws', () => {
    expect(() => maskCardNumber('12')).toThrow();
    expect(() => maskCardNumber('12ab')).toThrow();
  });

  it('given statuses and types when labelling then returns Spanish labels', () => {
    expect(statusLabel('blocked')).toBe('Bloqueada');
    expect(typeLabel('debit')).toBe('Débito');
  });

  it('given an amount when formatting then includes the digits and currency marker', () => {
    const text = formatMoney(1530.75, 'USD');
    expect(text).toMatch(/1[\s,.\u00a0]?530[.,]75/);
    // El marcador depende del ICU del entorno: código ISO ("USD") o símbolo ("$", "US$").
    expect(text).toMatch(/USD|US\$|\$/);
  });

  it('given different currencies when formatting then the currency marker differs', () => {
    expect(formatMoney(10, 'USD')).not.toBe(formatMoney(10, 'PEN'));
  });

  it('given a credit card when computing usage then returns used percentage', () => {
    expect(creditUsagePercent(credit)).toBe(75);
  });

  it('given a debit card when computing usage then returns undefined', () => {
    expect(creditUsagePercent({ ...credit, type: 'debit', creditLimit: undefined })).toBeUndefined();
  });

  it('given balance above limit when computing usage then it is clamped to 0', () => {
    expect(creditUsagePercent({ ...credit, availableBalance: 9000 })).toBe(0);
  });
});
