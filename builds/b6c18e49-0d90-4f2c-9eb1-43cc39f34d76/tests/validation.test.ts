import { describe, expect, it } from 'vitest';
import type { Card } from '../src/domain/types';
import { parseAmount, validateDraft } from '../src/domain/validation';

const cards: Card[] = [
  { id: 'a', alias: 'A', brand: 'Visa', last4: '1111', available: 100, status: 'active' },
  { id: 'b', alias: 'B', brand: 'Visa', last4: '2222', available: 100, status: 'blocked' },
];

describe('parseAmount', () => {
  it('given comma decimal when parsed then returns number', () => {
    expect(parseAmount('12,50')).toBe(12.5);
  });

  it('given invalid text when parsed then returns null', () => {
    expect(parseAmount('abc')).toBeNull();
    expect(parseAmount('1.234')).toBeNull();
    expect(parseAmount('-5')).toBeNull();
  });
});

describe('validateDraft', () => {
  it('given valid draft then no errors', () => {
    expect(validateDraft({ cardId: 'a', amountText: '50', merchant: 'Café' }, cards)).toEqual({});
  });

  it('given empty draft then all fields report errors', () => {
    const errors = validateDraft({ cardId: '', amountText: '', merchant: ' ' }, cards);
    expect(Object.keys(errors).sort()).toEqual(['amountText', 'cardId', 'merchant']);
  });

  it('given blocked card then card error', () => {
    const errors = validateDraft({ cardId: 'b', amountText: '5', merchant: 'X' }, cards);
    expect(errors.cardId).toBe('La tarjeta está bloqueada.');
  });

  it('given amount above available then amount error', () => {
    const errors = validateDraft({ cardId: 'a', amountText: '100.01', merchant: 'X' }, cards);
    expect(errors.amountText).toBe('El monto supera el saldo disponible.');
  });

  it('given zero amount then amount error', () => {
    const errors = validateDraft({ cardId: 'a', amountText: '0', merchant: 'X' }, cards);
    expect(errors.amountText).toBeDefined();
  });
});
