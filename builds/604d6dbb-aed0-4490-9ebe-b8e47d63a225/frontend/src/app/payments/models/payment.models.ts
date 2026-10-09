export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

export interface Account {
  id: string;
  number: string;
  currency: string;
  balance: number;
}

export interface PaymentRequest {
  sourceAccountId: string;
  targetAccount: string;
  amount: number;
  currency: string;
  reference: string;
}

export interface Payment {
  id: string;
  status: PaymentStatus;
  sourceAccountId: string;
  targetAccount: string;
  amount: number;
  currency: string;
  reference: string | null;
  createdAt: string;
}

export interface PaymentSubmission {
  request: PaymentRequest;
  idempotencyKey: string;
}
