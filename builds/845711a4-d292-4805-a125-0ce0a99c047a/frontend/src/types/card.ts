export type CardType = "CREDIT" | "DEBIT";
export type CardStatus = "ACTIVE" | "BLOCKED" | "EXPIRED";

export interface Card {
  id: string;
  maskedNumber: string;
  brand: string;
  type: CardType;
  status: CardStatus;
  creditLimit: number;
  availableBalance: number;
  currency: string;
  expiry: string;
}
