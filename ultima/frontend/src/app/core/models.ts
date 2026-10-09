export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

export interface PaymentRequest {
  sourceAccountId: string;
  beneficiaryAccount: string;
  amount: number;
  currency: string;
  concept: string;
}

export interface Payment extends PaymentRequest {
  id: string;
  status: PaymentStatus;
  failureReason: string | null;
  createdAt: string;
  processedAt: string | null;
}
