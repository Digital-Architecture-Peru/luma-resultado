export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

export interface Payment {
  id: string;
  reference: string;
  beneficiaryName: string;
  beneficiaryAccountMasked: string;
  /** Decimal serializado como string para no perder precisión. */
  amount: string;
  currency: string;
  status: PaymentStatus;
  executedAt: string | null;
}

export interface PageResult<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export interface PaymentFilters {
  from?: string;
  to?: string;
  status?: PaymentStatus | '';
  page?: number;
  size?: number;
}
