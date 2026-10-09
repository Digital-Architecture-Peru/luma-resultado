import { Account } from './account.model';

export const MAX_AMOUNT = 50000;
export const MAX_CONCEPT_LENGTH = 60;

export type TransferField = 'sourceId' | 'targetId' | 'amount' | 'concept';
export type TransferErrors = Partial<Record<TransferField, string>>;

export interface TransferDraft {
  readonly sourceId: string;
  readonly targetId: string;
  readonly amount: number;
  readonly concept: string;
}

/** Convierte texto del usuario ("1 250,50") a número; NaN si no es válido. */
export function parseAmount(raw: string): number {
  const normalized = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (normalized === '' || !/^\d+(\.\d+)?$/.test(normalized)) {
    return Number.NaN;
  }
  return Number(normalized);
}

function hasMoreThanTwoDecimals(value: number): boolean {
  return Math.abs(value * 100 - Math.round(value * 100)) > 1e-6;
}

export function validateTransfer(draft: TransferDraft, accounts: readonly Account[]): TransferErrors {
  const errors: TransferErrors = {};
  const source = accounts.find((a) => a.id === draft.sourceId);
  const target = accounts.find((a) => a.id === draft.targetId);

  if (!source) {
    errors.sourceId = 'Selecciona la cuenta de origen.';
  }
  if (!target) {
    errors.targetId = 'Selecciona la cuenta de destino.';
  } else if (source && source.id === target.id) {
    errors.targetId = 'La cuenta de destino debe ser distinta a la de origen.';
  }

  if (!Number.isFinite(draft.amount) || draft.amount <= 0) {
    errors.amount = 'Ingresa un monto mayor a cero.';
  } else if (hasMoreThanTwoDecimals(draft.amount)) {
    errors.amount = 'El monto admite como máximo dos decimales.';
  } else if (draft.amount > MAX_AMOUNT) {
    errors.amount = `El monto máximo por operación es ${MAX_AMOUNT}.`;
  } else if (source && draft.amount > source.balance) {
    errors.amount = 'Saldo insuficiente en la cuenta de origen.';
  }

  if (draft.concept.length > MAX_CONCEPT_LENGTH) {
    errors.concept = `El concepto admite hasta ${MAX_CONCEPT_LENGTH} caracteres.`;
  }
  return errors;
}

export function hasErrors(errors: TransferErrors): boolean {
  return Object.keys(errors).length > 0;
}
