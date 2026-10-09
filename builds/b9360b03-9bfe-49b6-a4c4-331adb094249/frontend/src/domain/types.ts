export type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Card {
  id: string;
  maskedPan: string;
  holderAlias: string;
}

export interface Transaction {
  id: string;
  cardId: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  createdAt: string;
  rejectionReason: string | null;
}

export interface PaymentRequest {
  cardId: string;
  amount: number;
  currency: string;
}

export const DEFAULT_CURRENCY = 'USD';

const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

/** Devuelve el importe numérico o un mensaje de error en español. */
export function parseAmount(raw: string): { value: number } | { error: string } {
  const text = raw.trim();
  if (!AMOUNT_PATTERN.test(text)) {
    return { error: 'Ingresa un importe válido con hasta 2 decimales.' };
  }
  const value = Number(text);
  if (value <= 0) {
    return { error: 'El importe debe ser mayor que cero.' };
  }
  return { value };
}
