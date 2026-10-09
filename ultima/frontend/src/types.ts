export interface Account {
  id: string;
  number: string;
  holder: string;
  currency: string;
  balance: number;
}

/** El monto viaja como string validado en la UI para evitar errores de punto flotante. */
export interface PaymentRequest {
  sourceAccountId: string;
  beneficiaryAccount: string;
  amount: string;
  currency: string;
  reference: string;
}

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

export interface PaymentResult {
  id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  beneficiaryAccount: string;
  reference: string;
  createdAt: string;
}
