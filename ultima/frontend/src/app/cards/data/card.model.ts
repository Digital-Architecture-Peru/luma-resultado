export type CardType = 'CREDIT' | 'DEBIT';
export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'EXPIRED';

export interface CardSummary {
  id: string;
  alias: string;
  maskedPan: string;
  type: CardType;
  brand: string;
  status: CardStatus;
}

export interface CardDetail extends CardSummary {
  creditLimit: number;
  availableBalance: number;
  currency: string;
  cutoffDay: number;
  expiry: string;
}
