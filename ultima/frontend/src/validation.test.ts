import { describe, expect, it } from 'vitest';
import { toPaymentRequest, validatePayment } from './validation';
import type { PaymentFormValues } from './types';

const valid: PaymentFormValues = {
  originAccount: '00012345678901',
  beneficiary: 'Empresa Demo',
  amount: '120.50',
  currency: 'PEN',
  concept: 'Recibo de luz',
};

describe('validatePayment', () => {
  it('given valid values when validating then no errors', () => {
    expect(validatePayment(valid)).toEqual({});
  });

  it('given short account when validating then account error', () => {
    expect(validatePayment({ ...valid, originAccount: '123' }).originAccount).toBeDefined();
  });

  it.each(['', '0', '-5', 'abc', '1.234', '50000.01'])('given amount "%s" when validating then amount error', (amount) => {
    expect(validatePayment({ ...valid, amount }).amount).toBeDefined();
  });

  it('given blank beneficiary and concept when validating then both errors', () => {
    const errors = validatePayment({ ...valid, beneficiary: ' ', concept: '' });
    expect(errors.beneficiary).toBeDefined();
    expect(errors.concept).toBeDefined();
  });
});

describe('toPaymentRequest', () => {
  it('given form values when mapping then amount is numeric and text trimmed', () => {
    const request = toPaymentRequest({ ...valid, beneficiary: '  Empresa Demo ' });
    expect(request.amount).toBe(120.5);
    expect(request.beneficiary).toBe('Empresa Demo');
  });
});
