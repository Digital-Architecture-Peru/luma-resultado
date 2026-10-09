import { FormControl } from '@angular/forms';
import { amountValidator } from './amount-input.component';

describe('amountValidator', () => {
  const check = (value: string) => amountValidator(new FormControl(value));

  it('given empty value, when validated, then required error', () => {
    expect(check('')).toEqual({ required: true });
  });

  it('given a valid amount with two decimals, when validated, then no error', () => {
    expect(check('25.50')).toBeNull();
  });

  it('given three decimals, when validated, then format error', () => {
    expect(check('1.234')).toEqual({ format: true });
  });

  it('given text, when validated, then format error', () => {
    expect(check('abc')).toEqual({ format: true });
  });

  it('given zero, when validated, then positive error', () => {
    expect(check('0.00')).toEqual({ positive: true });
  });
});
