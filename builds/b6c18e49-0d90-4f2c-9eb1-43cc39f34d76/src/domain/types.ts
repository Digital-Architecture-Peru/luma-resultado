export type CardStatus = 'active' | 'blocked';
export type TransactionStatus = 'approved' | 'rejected';

export interface Card {
  id: string;
  alias: string;
  brand: string;
  last4: string;
  available: number;
  status: CardStatus;
}

export interface TransactionInput {
  cardId: string;
  amount: number;
  merchant: string;
}

export interface Transaction extends TransactionInput {
  id: string;
  createdAt: string;
  status: TransactionStatus;
}

/** Valores tal como los escribe el usuario en el formulario. */
export interface TransactionDraft {
  cardId: string;
  amountText: string;
  merchant: string;
}

export type ValidationErrors = Partial<Record<keyof TransactionDraft, string>>;

export class TransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransactionError';
  }
}
