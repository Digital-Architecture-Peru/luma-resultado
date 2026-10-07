import { describe, expect, it } from 'vitest';
import type { Card, TransactionDraft } from '../src/domain/types';
import { MAX_AMOUNT, parseAmount, validateDraft } from '../src/domain/validation';

const card: Card = {
  id: 'c1', alias: 'Test', last4: '1111', brand: 'VISA',
  status: 'active', currency: 'COP', availableLimit: 1000,
};

function draft(overrides: Partial<TransactionDraft> = {}): TransactionDraft {
  return { cardId: 'c1', amount: '100', merchant: 'Proveedor SA', description: '', ...overrides };
}

describe('parseAmount', () => {
  it('given comma decimal when parsed then returns number', () => {
    expect(parseAmount('12,5')).toBe(12.5);
  });
  it('given text when parsed then returns NaN', () => {
    expect(parseAmount('abc')).toBeNaN();
    expect(parseAmount('')).toBeNaN();
    expect(parseAmount('-5')).toBeNaN();
  });
});

describe('validateDraft', () => {
  it('given valid draft when validated then returns normalized request', () => {
    const result = validateDraft(draft({ merchant: '  Proveedor SA ' }), card);
    expect(result.errors).toEqual({});
    expect(result.request).toEqual({ cardId: 'c1', amount: 100, merchant: 'Proveedor SA', description: '' });
  });
  it('given no card when validated then asks to select one', () => {
    expect(validateDraft(draft({ cardId: '' }), undefined).errors.cardId).toBeDefined();
  });
  it('given blocked card when validated then rejects', () => {
    const result = validateDraft(draft(), { ...card, status: 'blocked' });
    expect(result.errors.cardId).toMatch(/bloqueada/);
    expect(result.request).toBeUndefined();
  });
  it('given zero amount when validated then rejects', () => {
    expect(validateDraft(draft({ amount: '0' }), card).errors.amount).toMatch(/mayor que cero/);
  });
  it('given three decimals when validated then rejects', () => {
    expect(validateDraft(draft({ amount: '1.234' }), card).errors.amount).toMatch(/decimales/);
  });
  it('given amount above limit when validated then rejects', () => {
    expect(validateDraft(draft({ amount: '1001' }), card).errors.amount).toMatch(/cupo/);
  });
  it('given amount above max when validated then rejects', () => {
    const rich = { ...card, availableLimit: MAX_AMOUNT * 2 };
    expect(validateDraft(draft({ amount: String(MAX_AMOUNT + 1) }), rich).errors.amount).toMatch(/máximo/);
  });
  it('given empty merchant when validated then rejects', () => {
    expect(validateDraft(draft({ merchant: '   ' }), card).errors.merchant).toBeDefined();
  });
  it('given long description when validated then rejects', () => {
    expect(validateDraft(draft({ description: 'x'.repeat(121) }), card).errors.description).toBeDefined();
  });
});
