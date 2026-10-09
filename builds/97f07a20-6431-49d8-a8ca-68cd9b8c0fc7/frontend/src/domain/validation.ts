import type { Account, TransferFormErrors, TransferFormValues } from './types';

export const MAX_DESCRIPTION_LENGTH = 140;
const AMOUNT_PATTERN = /^\d{1,13}(\.\d{1,2})?$/;

/** Convierte "12.5" en 1250 centavos; devuelve null si el formato no es válido. */
export function toCents(amount: string): number | null {
  const text = amount.trim();
  if (!AMOUNT_PATTERN.test(text)) {
    return null;
  }
  const [whole, decimals = ''] = text.split('.');
  return Number(whole) * 100 + Number(decimals.padEnd(2, '0'));
}

export function validateTransfer(values: TransferFormValues, accounts: Account[]): TransferFormErrors {
  const errors: TransferFormErrors = {};
  const source = accounts.find((a) => String(a.id) === values.sourceAccountId);
  const target = accounts.find((a) => String(a.id) === values.targetAccountId);

  if (!source) {
    errors.sourceAccountId = 'Selecciona la cuenta de origen.';
  }
  if (!target) {
    errors.targetAccountId = 'Selecciona la cuenta de destino.';
  } else if (source && source.id === target.id) {
    errors.targetAccountId = 'La cuenta de destino debe ser distinta de la de origen.';
  } else if (source && source.currency !== target.currency) {
    errors.targetAccountId = 'Ambas cuentas deben tener la misma moneda.';
  }

  const cents = toCents(values.amount);
  if (cents === null) {
    errors.amount = 'Ingresa un monto válido con hasta 2 decimales.';
  } else if (cents <= 0) {
    errors.amount = 'El monto debe ser mayor que cero.';
  } else if (source && cents > (toCents(source.balance) ?? 0)) {
    errors.amount = 'El monto supera el saldo disponible.';
  }

  if (values.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `La descripción no puede superar ${MAX_DESCRIPTION_LENGTH} caracteres.`;
  }
  return errors;
}

export function hasErrors(errors: TransferFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
