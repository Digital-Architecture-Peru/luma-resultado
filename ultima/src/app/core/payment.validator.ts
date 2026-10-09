import { Account, PaymentDraft, PaymentErrors } from './payment.model';

export const MAX_AMOUNT = 50000;
export const MAX_CONCEPT_LENGTH = 80;
const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

export function parseAmount(raw: string): number | null {
  const text = raw.trim();
  return AMOUNT_PATTERN.test(text) ? Number(text) : null;
}

/** Reglas de negocio puras: sin Angular ni red, fáciles de probar. */
export function validatePayment(draft: PaymentDraft, accounts: readonly Account[]): PaymentErrors {
  const errors: PaymentErrors = {};
  const account = accounts.find((a) => a.id === draft.sourceAccountId);
  const amount = parseAmount(draft.amount);

  if (!account) {
    errors.sourceAccountId = 'Selecciona una cuenta de origen.';
  }
  if (draft.beneficiary.trim().length < 3) {
    errors.beneficiary = 'Ingresa el beneficiario (mínimo 3 caracteres).';
  }
  if (amount === null || amount <= 0) {
    errors.amount = 'Ingresa un monto válido mayor a cero (máximo 2 decimales).';
  } else if (amount > MAX_AMOUNT) {
    errors.amount = `El monto máximo por operación es ${MAX_AMOUNT}.`;
  } else if (account && amount > account.balance) {
    errors.amount = 'Saldo insuficiente en la cuenta seleccionada.';
  }
  if (draft.concept.trim().length > MAX_CONCEPT_LENGTH) {
    errors.concept = `El concepto admite máximo ${MAX_CONCEPT_LENGTH} caracteres.`;
  }
  return errors;
}

export function hasErrors(errors: PaymentErrors): boolean {
  return Object.keys(errors).length > 0;
}
