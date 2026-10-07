export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'EXPIRED';
export type CardType = 'CREDIT' | 'DEBIT';

/** Tarjeta de solo lectura. El número llega siempre enmascarado (nunca PAN completo ni CVV). */
export interface Card {
  readonly id: string;
  readonly alias: string;
  readonly maskedNumber: string;
  readonly holder: string;
  readonly type: CardType;
  readonly brand: string;
  readonly status: CardStatus;
  readonly expiry: string;
  readonly availableBalance: number;
  readonly creditLimit?: number;
  readonly currency: string;
}
