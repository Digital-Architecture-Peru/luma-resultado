export interface PaymentRequest {
  sourceAccount: string;
  beneficiary: string;
  amount: string;
  currency: string;
  reference: string;
}

export interface Payment extends PaymentRequest {
  id: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
}
