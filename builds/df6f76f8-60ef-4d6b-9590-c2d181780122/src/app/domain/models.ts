export type CardStatus = 'active' | 'blocked';
export type PaymentMode = 'minimum' | 'total' | 'custom';

export interface Card {
  readonly id: string;
  readonly alias: string;
  readonly maskedNumber: string;
  readonly brand: string;
  /** Deuda actual de la tarjeta. */
  readonly balance: number;
  readonly minimumPayment: number;
  readonly status: CardStatus;
}

export interface Account {
  readonly id: string;
  readonly alias: string;
  readonly maskedNumber: string;
  readonly available: number;
}

export interface PaymentRequest {
  readonly cardId: string;
  readonly accountId: string;
  readonly amount: number;
}

export interface PaymentReceipt {
  readonly reference: string;
  readonly cardId: string;
  readonly accountId: string;
  readonly amount: number;
  readonly date: string;
  readonly newCardBalance: number;
}
