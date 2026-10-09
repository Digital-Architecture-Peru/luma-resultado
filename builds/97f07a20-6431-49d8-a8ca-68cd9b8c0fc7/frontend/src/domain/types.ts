export interface Account {
  id: number;
  number: string;
  holderAlias: string;
  currency: string;
  /** Monto decimal como texto, p. ej. "1500.00". */
  balance: string;
}

export interface Movement {
  id: number;
  accountId: number;
  transferId: string;
  type: 'DEBIT' | 'CREDIT';
  amount: string;
  createdAt: string;
}

export interface TransferRequest {
  sourceAccountId: number;
  targetAccountId: number;
  amount: string;
  currency: string;
  description: string;
}

export interface TransferReceipt {
  id: string;
  sourceAccountId: number;
  targetAccountId: number;
  amount: string;
  currency: string;
  description: string;
  createdAt: string;
}

/** Valores crudos del formulario (todo texto). */
export interface TransferFormValues {
  sourceAccountId: string;
  targetAccountId: string;
  amount: string;
  description: string;
}

export type TransferFormErrors = Partial<Record<keyof TransferFormValues, string>>;
