export type CardStatus = 'ACTIVE' | 'BLOCKED';
export type TransactionType = 'PURCHASE' | 'PAYMENT';

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  PURCHASE: 'Consumo',
  PAYMENT: 'Pago de tarjeta',
};

export interface Card {
  readonly id: string;
  readonly alias: string;
  readonly maskedNumber: string;
  readonly currency: string;
  readonly creditLimit: number;
  readonly availableCredit: number;
  readonly status: CardStatus;
}

export interface TransactionRequest {
  readonly cardId: string;
  readonly type: TransactionType;
  readonly amount: number;
  readonly description: string;
}

export interface Transaction extends TransactionRequest {
  readonly id: string;
  readonly createdAt: string;
  readonly status: 'APPROVED';
}

export class TransactionRejectedError extends Error {
  constructor(readonly reasons: readonly string[]) {
    super(reasons.join(' '));
    this.name = 'TransactionRejectedError';
  }
}
