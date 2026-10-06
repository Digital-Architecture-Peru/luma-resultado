import { FormControl, FormGroup } from '@angular/forms';
import { Account } from '../../../core/accounts/model';
import { amountValidator, differentAccounts, sufficientFunds } from './transfer.validators';

describe('transfer validators', () => {
  const accounts: Account[] = [
    { id: 'a', alias: 'A', maskedNumber: '****1', balanceCents: 10000, currency: 'PEN' },
    { id: 'b', alias: 'B', maskedNumber: '****2', balanceCents: 0, currency: 'PEN' },
  ];

  const group = (fromId: string, toId: string, amount: number | null) =>
    new FormGroup(
      {
        fromId: new FormControl(fromId),
        toId: new FormControl(toId),
        amount: new FormControl(amount),
      },
      { validators: [differentAccounts, sufficientFunds(() => accounts)] },
    );

  describe('amountValidator', () => {
    const validate = (v: unknown) => amountValidator()(new FormControl(v));

    it('given empty value then required', () => {
      expect(validate(null)).toEqual({ required: true });
    });
    it('given zero or negative then amountInvalid', () => {
      expect(validate(0)).toEqual({ amountInvalid: true });
      expect(validate(-5)).toEqual({ amountInvalid: true });
    });
    it('given 3 decimals then amountDecimals', () => {
      expect(validate(1.234)).toEqual({ amountDecimals: true });
    });
    it('given valid amount then no error', () => {
      expect(validate(25.5)).toBeNull();
    });
  });

  it('given same origin and destination then sameAccount', () => {
    expect(group('a', 'a', 10).errors).toEqual({ sameAccount: true });
  });

  it('given different accounts then no sameAccount error', () => {
    expect(group('a', 'b', 10).errors).toBeNull();
  });

  it('given amount above balance then insufficientFunds', () => {
    expect(group('a', 'b', 100.01).errors).toEqual({ insufficientFunds: true });
  });

  it('given amount equal to balance then valid', () => {
    expect(group('a', 'b', 100).errors).toBeNull();
  });

  it('given missing amount then funds check is skipped', () => {
    expect(group('a', 'b', null).errors).toBeNull();
  });
});
