export type CardType = "CREDIT" | "DEBIT";
export type CardStatus = "ACTIVE" | "BLOCKED" | "EXPIRED";

export interface CardSummary {
  id: string;
  alias: string;
  maskedNumber: string;
  type: CardType;
  status: CardStatus;
  availableBalance: number;
  currency: string;
}

export interface CardDetail {
  id: string;
  alias: string;
  maskedNumber: string;
  type: CardType;
  status: CardStatus;
  creditLimit: number;
  availableBalance: number;
  currency: string;
  expiryDate: string;
}
