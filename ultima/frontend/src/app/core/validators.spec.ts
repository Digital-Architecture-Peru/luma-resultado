import { FormControl, FormGroup } from '@angular/forms';
import { amountValidator, differentAccountsValidator } from './validators';

describe('amountValidator', () => {
  const validate = (value: string) => amountValidator(100)(new FormControl(value));

  it('given zero, when validated, then reports amountPositive', () => {
    expect(validate('0')?.['amountPositive']).toBeDefined();
  });

  it('given a negative value, when validated, then reports amountPositive', () => {
    expect(validate('-3')?.['amountPositive']).toBeDefined();
  });

  it('given a value above the limit, when validated, then reports amountMax', () => {
    expect(validate('100.01')?.['amountMax']).toBeDefined();
  });

  it('given three decimals, when validated, then reports amountScale', () => {
    expect(validate('10.123')?.['amountScale']).toBeDefined();
  });

  it('given non numeric text, when validated, then reports amountInvalid', () => {
    expect(validate('abc')?.['amountInvalid']).toBeDefined();
  });

  it('given a valid amount, when validated, then returns null', () => {
    expect(validate('50.25')).toBeNull();
  });
});

describe('differentAccountsValidator', () => {
  const group = (source: string, target: string) =>
    new FormGroup({ sourceAccountId: new FormControl(source), beneficiaryAccount: new FormControl(target) });

  it('given equal accounts, when validated, then reports sameAccount', () => {
    expect(differentAccountsValidator(group('0010000000', '0010000000'))?.['sameAccount']).toBeDefined();
  });

  it('given different accounts, when validated, then returns null', () => {
    expect(differentAccountsValidator(group('0010000000', '0020000000'))).toBeNull();
  });
});
