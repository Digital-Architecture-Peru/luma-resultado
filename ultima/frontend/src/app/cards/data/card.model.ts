export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'CANCELLED';
export type CardType = 'CREDIT' | 'DEBIT';

export interface CardSummary {
  id: string;
  maskedPan: string;
  brand: string;
  cardType: CardType;
  status: CardStatus;
  availableBalance: number;
  currency: string;
}

export interface CardDetail extends CardSummary {
  panLast4: string;
  creditLimit: number | null;
  createdAt: string;
}
