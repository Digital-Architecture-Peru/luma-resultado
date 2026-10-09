import { Cents } from './money';

export type CardStatus = 'ACTIVE' | 'BLOCKED';
export type CardBrand = 'VISA' | 'MASTERCARD';

export interface Card {
  readonly id: string;
  readonly alias: string;
  readonly brand: CardBrand;
  /** Solo los últimos 4 dígitos; nunca se maneja el número completo. */
  readonly last4: string;
  readonly status: CardStatus;
  readonly creditLimitCents: Cents;
  readonly availableCents: Cents;
}

export function maskedNumber(card: Card): string {
  return `•••• •••• •••• ${card.last4}`;
}

export function owedCents(card: Card): Cents {
  return card.creditLimitCents - card.availableCents;
}
