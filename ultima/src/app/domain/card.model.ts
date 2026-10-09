export type CardType = 'credit' | 'debit';
export type CardStatus = 'active' | 'blocked' | 'expired';
export type CurrencyCode = 'PEN' | 'USD';

export interface Card {
  readonly id: string;
  readonly holder: string;
  readonly last4: string;
  readonly brand: string;
  readonly type: CardType;
  readonly status: CardStatus;
  /** Vencimiento en formato MM/AA. */
  readonly expiry: string;
  readonly currency: CurrencyCode;
  readonly availableBalance: number;
  /** Solo aplica a tarjetas de crédito. */
  readonly creditLimit?: number;
}

export type StatusFilter = CardStatus | 'all';

export interface CardQuery {
  readonly text: string;
  readonly status: StatusFilter;
}
