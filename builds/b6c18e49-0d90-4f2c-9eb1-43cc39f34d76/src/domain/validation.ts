import type { Card, TransactionDraft, ValidationErrors } from './types';

const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;
export const MAX_MERCHANT_LENGTH = 40;

/** Convierte "12,50" o "12.50" a número; devuelve null si el formato es inválido. */
export function parseAmount(text: string): number | null {
  const normalized = text.trim().replace(',', '.');
  if (!AMOUNT_PATTERN.test(normalized)) return null;
  return Number(normalized);
}

export function validateDraft(draft: TransactionDraft, cards: readonly Card[]): ValidationErrors {
  const errors: ValidationErrors = {};
  const card = cards.find((c) => c.id === draft.cardId);

  if (!card) {
    errors.cardId = 'Selecciona una tarjeta.';
  } else if (card.status === 'blocked') {
    errors.cardId = 'La tarjeta está bloqueada.';
  }

  const amount = parseAmount(draft.amountText);
  if (amount === null || amount <= 0) {
    errors.amountText = 'Ingresa un monto mayor a 0 con hasta 2 decimales.';
  } else if (card && card.status === 'active' && amount > card.available) {
    errors.amountText = 'El monto supera el saldo disponible.';
  }

  const merchant = draft.merchant.trim();
  if (merchant.length === 0) {
    errors.merchant = 'Ingresa el comercio.';
  } else if (merchant.length > MAX_MERCHANT_LENGTH) {
    errors.merchant = `Máximo ${MAX_MERCHANT_LENGTH} caracteres.`;
  }

  return errors;
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(value);
}
