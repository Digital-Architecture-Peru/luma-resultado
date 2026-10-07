import type { Card, FieldErrors, TransactionDraft, TransactionRequest } from './types';

export const MAX_AMOUNT = 50_000_000;
export const MAX_MERCHANT_LENGTH = 60;
export const MAX_DESCRIPTION_LENGTH = 120;

export interface ValidationResult {
  errors: FieldErrors;
  request?: TransactionRequest;
}

export function parseAmount(raw: string): number {
  const normalized = raw.trim().replace(',', '.');
  if (normalized === '' || !/^\d+(\.\d+)?$/.test(normalized)) return Number.NaN;
  return Number(normalized);
}

function hasMoreThanTwoDecimals(value: number): boolean {
  return Math.round(value * 100) / 100 !== value;
}

function validateAmount(raw: string, card: Card | undefined): string | undefined {
  const amount = parseAmount(raw);
  if (Number.isNaN(amount)) return 'Ingresa un monto numérico.';
  if (amount <= 0) return 'El monto debe ser mayor que cero.';
  if (hasMoreThanTwoDecimals(amount)) return 'Usa máximo dos decimales.';
  if (amount > MAX_AMOUNT) return 'El monto supera el máximo permitido por transacción.';
  if (card && amount > card.availableLimit) return 'El monto supera el cupo disponible.';
  return undefined;
}

function validateCard(card: Card | undefined): string | undefined {
  if (!card) return 'Selecciona una tarjeta.';
  if (card.status === 'blocked') return 'La tarjeta está bloqueada.';
  return undefined;
}

function validateMerchant(raw: string): string | undefined {
  const merchant = raw.trim();
  if (merchant.length === 0) return 'Indica el comercio o beneficiario.';
  if (merchant.length > MAX_MERCHANT_LENGTH) return `Máximo ${MAX_MERCHANT_LENGTH} caracteres.`;
  return undefined;
}

export function validateDraft(draft: TransactionDraft, card: Card | undefined): ValidationResult {
  const errors: FieldErrors = {};
  const cardError = validateCard(card);
  const amountError = validateAmount(draft.amount, card);
  const merchantError = validateMerchant(draft.merchant);
  if (cardError) errors.cardId = cardError;
  if (amountError) errors.amount = amountError;
  if (merchantError) errors.merchant = merchantError;
  if (draft.description.trim().length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Máximo ${MAX_DESCRIPTION_LENGTH} caracteres.`;
  }
  if (Object.keys(errors).length > 0) return { errors };
  return {
    errors,
    request: {
      cardId: draft.cardId,
      amount: parseAmount(draft.amount),
      merchant: draft.merchant.trim(),
      description: draft.description.trim(),
    },
  };
}
