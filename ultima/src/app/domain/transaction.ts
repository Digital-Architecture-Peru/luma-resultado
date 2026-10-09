import { Card, owedCents } from './card';
import { Cents, formatCents } from './money';

export type TransactionType = 'PAYMENT' | 'CASH_ADVANCE';

export const TRANSACTION_LABELS: Record<TransactionType, string> = {
  PAYMENT: 'Pago de tarjeta',
  CASH_ADVANCE: 'Avance de efectivo',
};

export const MAX_DESCRIPTION_LENGTH = 60;

export interface TransactionRequest {
  readonly cardId: string;
  readonly type: TransactionType;
  /** null cuando el texto ingresado no es un importe válido. */
  readonly amountCents: Cents | null;
  readonly description: string;
}

export interface TransactionReceipt {
  readonly reference: string;
  readonly cardId: string;
  readonly type: TransactionType;
  readonly amountCents: Cents;
  readonly description: string;
  readonly availableAfterCents: Cents;
  readonly at: string;
}

export interface ValidationErrors {
  card?: string;
  amount?: string;
  description?: string;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

function validateAmount(card: Card, request: TransactionRequest): string | undefined {
  const amount = request.amountCents;
  if (amount === null) {
    return 'Ingrese un monto válido (máximo 2 decimales).';
  }
  if (amount <= 0) {
    return 'El monto debe ser mayor a cero.';
  }
  if (request.type === 'PAYMENT' && amount > owedCents(card)) {
    return `El pago no puede superar la deuda actual (${formatCents(owedCents(card))}).`;
  }
  if (request.type === 'CASH_ADVANCE' && amount > card.availableCents) {
    return `El monto supera el cupo disponible (${formatCents(card.availableCents)}).`;
  }
  return undefined;
}

export function validateTransaction(card: Card | undefined, request: TransactionRequest): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!card) {
    errors.card = 'Seleccione una tarjeta.';
    return errors;
  }
  if (card.status !== 'ACTIVE') {
    errors.card = 'La tarjeta está bloqueada y no admite transacciones.';
    return errors;
  }
  const amountError = validateAmount(card, request);
  if (amountError) {
    errors.amount = amountError;
  }
  if (request.description.trim().length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `La descripción no puede superar ${MAX_DESCRIPTION_LENGTH} caracteres.`;
  }
  return errors;
}

/** Devuelve la tarjeta con el nuevo cupo disponible; asume una solicitud ya validada. */
export function applyTransaction(card: Card, type: TransactionType, amountCents: Cents): Card {
  const delta = type === 'PAYMENT' ? amountCents : -amountCents;
  return { ...card, availableCents: card.availableCents + delta };
}

export class TransactionRejectedError extends Error {
  constructor(readonly errors: ValidationErrors) {
    super(Object.values(errors)[0] ?? 'Transacción rechazada.');
    this.name = 'TransactionRejectedError';
  }
}
