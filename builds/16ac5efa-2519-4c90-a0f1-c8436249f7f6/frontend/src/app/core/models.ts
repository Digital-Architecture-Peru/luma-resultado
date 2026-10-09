export interface Account {
  id: number;
  numberMasked: string;
  currency: string;
  /** Decimal como string para no perder precision. */
  balance: string;
}

export interface TransferRequest {
  sourceAccountId: number;
  targetAccountId: number;
  amount: string;
  currency: string;
  description: string;
}

export interface TransferResponse {
  transferId: string;
  status: string;
  createdAt: string;
}

export interface Movement {
  id: number;
  accountId: number;
  transferId: string;
  type: 'DEBIT' | 'CREDIT';
  amount: string;
  createdAt: string;
}

export interface SubmittedTransfer {
  request: TransferRequest;
  idempotencyKey: string;
}
