export interface Account {
  id: number;
  number: string;
  holder: string;
  currency: string;
  /** Monto como string decimal con 2 decimales, p. ej. "1500.00". */
  balance: string;
}

export interface Transaction {
  id: number;
  accountId: number;
  transferId: number;
  type: "DEBIT" | "CREDIT";
  amount: string;
  description: string | null;
  createdAt: string;
}

export interface TransferRequest {
  sourceAccountId: number;
  targetAccountId: number;
  amount: string;
  description: string;
}

export interface TransferResult {
  id: number;
  sourceAccountId: number;
  targetAccountId: number;
  amount: string;
  status: string;
  createdAt: string;
}

/** Valores crudos del formulario (todo texto). */
export interface TransferFormValues {
  sourceId: string;
  targetId: string;
  amount: string;
  description: string;
}

export interface TransferErrors {
  source?: string;
  target?: string;
  amount?: string;
}
