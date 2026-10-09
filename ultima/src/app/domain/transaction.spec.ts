import { describe, expect, it } from 'vitest';
import { Card } from './card';
import { parseAmountToCents } from './money';
import { TransactionRequest, applyTransaction, hasErrors, validateTransaction } from './transaction';

const activeCard: Card = {
  id: 'c1',
  alias: 'Test',
  brand: 'VISA',
  last4: '0001',
  status: 'ACTIVE',
  creditLimitCents: 100000,
  availableCents: 60000,
};

function request(overrides: Partial<TransactionRequest> = {}): TransactionRequest {
  return { cardId: 'c1', type: 'PAYMENT', amountCents: 1000, description: '', ...overrides };
}

describe('parseAmountToCents', () => {
  it('given valid text when parsing then returns cents', () => {
    expect(parseAmountToCents('25.5')).toBe(2550);
    expect(parseAmountToCents(' 10,05 ')).toBe(1005);
    expect(parseAmountToCents('7')).toBe(700);
  });

  it('given invalid text when parsing then returns null', () => {
    expect(parseAmountToCents('')).toBeNull();
    expect(parseAmountToCents('abc')).toBeNull();
    expect(parseAmountToCents('1.234')).toBeNull();
    expect(parseAmountToCents('-5')).toBeNull();
  });
});

describe('validateTransaction', () => {
  it('given a valid payment then has no errors', () => {
    expect(hasErrors(validateTransaction(activeCard, request()))).toBe(false);
  });

  it('given no card then reports card error', () => {
    expect(validateTransaction(undefined, request()).card).toBeDefined();
  });

  it('given a blocked card then rejects', () => {
    const blocked: Card = { ...activeCard, status: 'BLOCKED' };
    expect(validateTransaction(blocked, request()).card).toContain('bloqueada');
  });

  it('given null or non-positive amount then reports amount error', () => {
    expect(validateTransaction(activeCard, request({ amountCents: null })).amount).toBeDefined();
    expect(validateTransaction(activeCard, request({ amountCents: 0 })).amount).toBeDefined();
  });

  it('given payment above debt then rejects', () => {
    expect(validateTransaction(activeCard, request({ amountCents: 40001 })).amount).toBeDefined();
    expect(validateTransaction(activeCard, request({ amountCents: 40000 })).amount).toBeUndefined();
  });

  it('given cash advance above available then rejects', () => {
    const advance = request({ type: 'CASH_ADVANCE', amountCents: 60001 });
    expect(validateTransaction(activeCard, advance).amount).toBeDefined();
  });

  it('given a too long description then reports description error', () => {
    expect(validateTransaction(activeCard, request({ description: 'x'.repeat(61) })).description).toBeDefined();
  });
});

describe('applyTransaction', () => {
  it('given payment then available increases', () => {
    expect(applyTransaction(activeCard, 'PAYMENT', 5000).availableCents).toBe(65000);
  });

  it('given cash advance then available decreases without mutating input', () => {
    const result = applyTransaction(activeCard, 'CASH_ADVANCE', 5000);
    expect(result.availableCents).toBe(55000);
    expect(activeCard.availableCents).toBe(60000);
  });
});
