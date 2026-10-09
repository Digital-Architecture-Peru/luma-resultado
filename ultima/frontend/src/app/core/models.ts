export interface Card {
  id: string;
  maskedPan: string;
  alias: string;
  creditLimit: number;
  availableBalance: number;
  outstandingBalance: number;
  currency: string;
}

export interface CardTransaction {
  id: string;
  cardId: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  sourceAccountAlias: string;
}
