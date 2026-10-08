export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
export type CardType = 'CREDIT' | 'DEBIT';

export interface CardSummary {
  id: string;
  maskedPan: string;
  type: CardType;
  status: CardStatus;
  availableBalance: number;
  currency: string;
}

export interface CardDetail extends CardSummary {
  creditLimit: number;
  expiryMonth: number;
  expiryYear: number;
}
