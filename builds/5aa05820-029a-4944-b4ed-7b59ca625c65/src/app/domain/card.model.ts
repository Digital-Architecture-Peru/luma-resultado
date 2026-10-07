export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'EXPIRED';

export type StatusFilter = CardStatus | 'ALL';

/** Nunca se maneja el número completo: solo los últimos 4 dígitos. */
export interface Card {
  readonly id: string;
  readonly holder: string;
  readonly last4: string;
  readonly brand: string;
  readonly status: CardStatus;
  readonly expiry: string;
  readonly creditLimit: number;
  readonly balance: number;
  readonly currency: string;
}

export interface CardQuery {
  readonly text: string;
  readonly status: StatusFilter;
}

export const STATUS_LABELS: Readonly<Record<CardStatus, string>> = {
  ACTIVE: 'Activa',
  BLOCKED: 'Bloqueada',
  EXPIRED: 'Vencida',
};
