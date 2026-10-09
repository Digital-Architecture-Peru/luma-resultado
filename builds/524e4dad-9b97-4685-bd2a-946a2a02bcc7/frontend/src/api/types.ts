export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

export interface Payment {
  id: string;
  beneficiary: string;
  accountMasked: string;
  /** Decimal como string (no usar number para importes). */
  amount: string;
  currency: string;
  status: PaymentStatus;
  paidAt: string;
  reference: string;
}

export interface PagedPayments {
  items: Payment[];
  page: number;
  pageSize: number;
  total: number;
}

export interface PaymentsQuery {
  from?: string;
  to?: string;
  status?: PaymentStatus | '';
  page: number;
  pageSize: number;
}
