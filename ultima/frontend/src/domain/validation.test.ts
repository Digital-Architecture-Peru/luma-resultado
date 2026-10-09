import { describe, expect, it } from 'vitest';
import type { Account, TransferFormValues } from './types';
import { toCents, validateTransfer } from './validation';

const accounts: Account[] = [
  { id: 1, number: '0001', holderAlias: 'Ahorros', currency: 'USD', balance: '100.00' },
  { id: 2, number: '0002', holderAlias: 'Corriente', currency: 'USD', balance: '10.50' },
  { id: 3, number: '0003', holderAlias: 'Euros', currency: 'EUR', balance: '50.00' },
];

const valid: TransferFormValues = { sourceAccountId: '1', targetAccountId: '2', amount: '25.50', description: '' };

describe('toCents', () => {
  it('given decimal text, when converting, then returns integer cents', () => {
    expect(toCents('12.5')).toBe(1250);
    expect(toCents('0.05')).toBe(5);
    expect(toCents('7')).toBe(700);
  });

  it('given malformed text, when converting, then returns null', () => {
    expect(toCents('')).toBeNull();
    expect(toCents('1.234')).toBeNull();
    expect(toCents('-5')).toBeNull();
    expect(toCents('abc')).toBeNull();
  });
});

describe('validateTransfer', () => {
  it('given valid values, when validating, then has no errors', () => {
    expect(validateTransfer(valid, accounts)).toEqual({});
  });

  it('given empty selection, when validating, then requires both accounts', () => {
    const errors = validateTransfer({ ...valid, sourceAccountId: '', targetAccountId: '' }, accounts);
    expect(errors.sourceAccountId).toBeDefined();
    expect(errors.targetAccountId).toBeDefined();
  });

  it('given same account, when validating, then rejects the target', () => {
    expect(validateTransfer({ ...valid, targetAccountId: '1' }, accounts).targetAccountId).toMatch(/distinta/);
  });

  it('given different currencies, when validating, then rejects the target', () => {
    expect(validateTransfer({ ...valid, targetAccountId: '3' }, accounts).targetAccountId).toMatch(/moneda/);
  });

  it('given zero amount, when validating, then asks for a positive amount', () => {
    expect(validateTransfer({ ...valid, amount: '0' }, accounts).amount).toMatch(/mayor que cero/);
  });

  it('given amount above balance, when validating, then reports insufficient balance', () => {
    expect(validateTransfer({ ...valid, amount: '100.01' }, accounts).amount).toMatch(/saldo/);
  });

  it('given amount equal to balance, when validating, then is accepted', () => {
    expect(validateTransfer({ ...valid, amount: '100.00' }, accounts).amount).toBeUndefined();
  });

  it('given a long description, when validating, then rejects it', () => {
    expect(validateTransfer({ ...valid, description: 'x'.repeat(141) }, accounts).description).toBeDefined();
  });
});
