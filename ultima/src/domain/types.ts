export type Currency = 'COP' | 'USD';
export type CardStatus = 'active' | 'blocked';

export interface Card {
  id: string;
  alias: string;
  last4: string;
  brand: 'VISA' | 'MASTERCARD';
  status: CardStatus;
  currency: Currency;
  availableLimit: number;
}

export interface TransactionRequest {
  cardId: string;
  amount: number;
  merchant: string;
  description: string;
}

export interface TransactionRecord {
  id: string;
  cardId: string;
  amount: number;
  currency: Currency;
  merchant: string;
  description: string;
  status: 'approved';
  createdAt: string;
}

/** Datos tal como los escribe el usuario en el formulario. */
export interface TransactionDraft {
  cardId: string;
  amount: string;
  merchant: string;
  description: string;
}

export type FieldErrors = Partial<Record<keyof TransactionDraft, string>>;
