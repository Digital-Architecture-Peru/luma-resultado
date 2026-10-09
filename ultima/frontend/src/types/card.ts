export type CardStatus = "ACTIVE" | "BLOCKED" | "CANCELLED";

export interface CardSummary {
  id: string;
  productName: string;
  brand: string;
  maskedPan: string;
  status: CardStatus;
  currency: string;
  availableBalance: number;
}

export interface CardDetail extends CardSummary {
  creditLimit: number;
  expiry: string;
}
