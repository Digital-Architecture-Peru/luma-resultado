import { describe, expect, it } from 'vitest';
import { parseAmount, toPaymentRequest, validatePayment, type Account, type PaymentFormValues } from '../src/domain/payment';

const accounts: Account[] = [{ id: 'a1', alias: 'Sueldo', maskedNumber: '****1', balance: 100 }];

function values(overrides: Partial<PaymentFormValues> = {}): PaymentFormValues {
  return { sourceAccountId: 'a1', beneficiaryId: 'b1', amount: '40.50', concept: 'Luz', ...overrides };
}

describe('parseAmount', () => {
  it('given comma decimal when parsed then returns number', () => {
    expect(parseAmount('12,5')).toBe(12.5);
  });

  it.each(['', 'abc', '-3', '1.234', '1e3'])('given "%s" then returns null', (text) => {
    expect(parseAmount(text)).toBeNull();
  });
});

describe('validatePayment', () => {
  it('given valid values then no errors', () => {
    expect(validatePayment(values(), accounts)).toEqual({});
  });

  it('given empty form then reports every field', () => {
    const errors = validatePayment({ sourceAccountId: '', beneficiaryId: '', amount: '', concept: '' }, accounts);
    expect(Object.keys(errors).sort()).toEqual(['amount', 'beneficiaryId', 'concept', 'sourceAccountId']);
  });

  it('given amount above balance then reports insufficient funds', () => {
    expect(validatePayment(values({ amount: '100.01' }), accounts).amount).toMatch(/insuficiente/i);
  });

  it('given amount above per-operation limit then reports limit', () => {
    const rich: Account[] = [{ ...accounts[0], balance: 1_000_000 }];
    expect(validatePayment(values({ amount: '50000.01' }), rich).amount).toMatch(/máximo/i);
  });

  it('given too long concept then reports concept error', () => {
    expect(validatePayment(values({ concept: 'x'.repeat(61) }), accounts).concept).toBeDefined();
  });
});

describe('toPaymentRequest', () => {
  it('given form values then trims concept and parses amount', () => {
    expect(toPaymentRequest(values({ concept: '  Luz  ' }))).toEqual({
      sourceAccountId: 'a1',
      beneficiaryId: 'b1',
      amount: 40.5,
      concept: 'Luz'
    });
  });

  it('given invalid amount then throws', () => {
    expect(() => toPaymentRequest(values({ amount: 'x' }))).toThrow();
  });
});
