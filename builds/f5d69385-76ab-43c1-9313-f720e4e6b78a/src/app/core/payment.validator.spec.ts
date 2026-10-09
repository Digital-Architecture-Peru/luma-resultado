import { Account, PaymentDraft } from './payment.model';
import { MAX_AMOUNT, hasErrors, parseAmount, validatePayment } from './payment.validator';

const accounts: Account[] = [{ id: 'A1', name: 'Cuenta A', balance: 100 }];
const valid: PaymentDraft = { sourceAccountId: 'A1', beneficiary: 'Empresa Luz', amount: '25.50', concept: 'Servicio' };

describe('validatePayment', () => {
  it('given a valid draft when validating then returns no errors', () => {
    expect(hasErrors(validatePayment(valid, accounts))).toBe(false);
  });

  it('given no account when validating then flags sourceAccountId', () => {
    expect(validatePayment({ ...valid, sourceAccountId: '' }, accounts).sourceAccountId).toBeDefined();
  });

  it('given a short beneficiary when validating then flags beneficiary', () => {
    expect(validatePayment({ ...valid, beneficiary: ' ab ' }, accounts).beneficiary).toBeDefined();
  });

  it.each(['', 'abc', '0', '-5', '1.234', '1,5'])('given amount "%s" when validating then flags amount', (amount) => {
    expect(validatePayment({ ...valid, amount }, accounts).amount).toBeDefined();
  });

  it('given amount above balance when validating then reports insufficient funds', () => {
    expect(validatePayment({ ...valid, amount: '100.01' }, accounts).amount).toContain('Saldo insuficiente');
  });

  it('given amount above the limit when validating then reports the maximum', () => {
    const rich: Account[] = [{ id: 'A1', name: 'Cuenta A', balance: MAX_AMOUNT * 2 }];
    expect(validatePayment({ ...valid, amount: String(MAX_AMOUNT + 1) }, rich).amount).toContain('máximo');
  });

  it('given a too long concept when validating then flags concept', () => {
    expect(validatePayment({ ...valid, concept: 'x'.repeat(81) }, accounts).concept).toBeDefined();
  });
});

describe('parseAmount', () => {
  it('parses decimals with a dot and rejects invalid text', () => {
    expect(parseAmount(' 10.5 ')).toBe(10.5);
    expect(parseAmount('10,5')).toBeNull();
  });
});
