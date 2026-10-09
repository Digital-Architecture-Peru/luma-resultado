import { MAX_AMOUNT, type PaymentFormErrors, type PaymentFormValues, type PaymentRequest } from './types';

const ACCOUNT_PATTERN = /^[0-9]{10,20}$/;
const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

export function validatePayment(values: PaymentFormValues): PaymentFormErrors {
  const errors: PaymentFormErrors = {};
  if (!ACCOUNT_PATTERN.test(values.originAccount.trim())) {
    errors.originAccount = 'La cuenta debe tener entre 10 y 20 digitos';
  }
  if (values.beneficiary.trim() === '') {
    errors.beneficiary = 'El beneficiario es obligatorio';
  }
  if (values.concept.trim() === '') {
    errors.concept = 'El concepto es obligatorio';
  }
  const amountError = validateAmount(values.amount.trim());
  if (amountError) {
    errors.amount = amountError;
  }
  return errors;
}

function validateAmount(raw: string): string | undefined {
  if (!AMOUNT_PATTERN.test(raw)) {
    return 'Ingresa un importe valido (maximo 2 decimales)';
  }
  const value = Number(raw);
  if (value <= 0) {
    return 'El importe debe ser mayor que cero';
  }
  if (value > MAX_AMOUNT) {
    return `El importe no puede superar ${MAX_AMOUNT}`;
  }
  return undefined;
}

export function toPaymentRequest(values: PaymentFormValues): PaymentRequest {
  return {
    originAccount: values.originAccount.trim(),
    beneficiary: values.beneficiary.trim(),
    amount: Number(values.amount.trim()),
    currency: values.currency,
    concept: values.concept.trim(),
  };
}
