import { Account } from './account.model';
import { MAX_AMOUNT, hasErrors, parseAmount, validateTransfer } from './transfer.validator';

const accounts: Account[] = [
  { id: 'a', alias: 'A', number: '1', currency: 'PEN', balance: 1000 },
  { id: 'b', alias: 'B', number: '2', currency: 'PEN', balance: 50 },
];

describe('parseAmount', () => {
  it('given comma decimal when parsed then returns number', () => {
    expect(parseAmount('1 250,50')).toBe(1250.5);
  });

  it.each(['', 'abc', '-5', '1.2.3'])('given "%s" when parsed then returns NaN', (raw) => {
    expect(Number.isNaN(parseAmount(raw))).toBe(true);
  });
});

describe('validateTransfer', () => {
  const valid = { sourceId: 'a', targetId: 'b', amount: 100, concept: 'Alquiler' };

  it('given a valid draft when validated then has no errors', () => {
    expect(hasErrors(validateTransfer(valid, accounts))).toBe(false);
  });

  it('given missing accounts when validated then reports both', () => {
    const errors = validateTransfer({ ...valid, sourceId: '', targetId: '' }, accounts);
    expect(errors.sourceId).toBeDefined();
    expect(errors.targetId).toBeDefined();
  });

  it('given same source and target when validated then rejects target', () => {
    expect(validateTransfer({ ...valid, targetId: 'a' }, accounts).targetId).toContain('distinta');
  });

  it('given zero or NaN amount when validated then rejects amount', () => {
    expect(validateTransfer({ ...valid, amount: 0 }, accounts).amount).toBeDefined();
    expect(validateTransfer({ ...valid, amount: Number.NaN }, accounts).amount).toBeDefined();
  });

  it('given three decimals when validated then rejects amount', () => {
    expect(validateTransfer({ ...valid, amount: 10.123 }, accounts).amount).toContain('decimales');
  });

  it('given amount above balance when validated then reports insufficient funds', () => {
    expect(validateTransfer({ ...valid, sourceId: 'b', targetId: 'a', amount: 60 }, accounts).amount).toContain(
      'insuficiente',
    );
  });

  it('given amount above limit when validated then reports the limit', () => {
    const rich: Account[] = [{ ...accounts[0], balance: MAX_AMOUNT * 2 }, accounts[1]];
    expect(validateTransfer({ ...valid, amount: MAX_AMOUNT + 1 }, rich).amount).toContain('máximo');
  });

  it('given overlong concept when validated then rejects concept', () => {
    expect(validateTransfer({ ...valid, concept: 'x'.repeat(61) }, accounts).concept).toBeDefined();
  });
});
