export type PaymentStatus = 'COMPLETED' | 'PENDING' | 'REJECTED';

export interface Payment {
  readonly id: string;
  /** Fecha ISO yyyy-mm-dd */
  readonly date: string;
  readonly beneficiary: string;
  readonly concept: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: PaymentStatus;
}

export type StatusFilter = PaymentStatus | 'ALL';

export interface PaymentFilter {
  readonly text: string;
  readonly status: StatusFilter;
}

export const EMPTY_FILTER: PaymentFilter = { text: '', status: 'ALL' };

export const STATUS_LABELS: Record<PaymentStatus, string> = {
  COMPLETED: 'Completado',
  PENDING: 'Pendiente',
  REJECTED: 'Rechazado',
};
