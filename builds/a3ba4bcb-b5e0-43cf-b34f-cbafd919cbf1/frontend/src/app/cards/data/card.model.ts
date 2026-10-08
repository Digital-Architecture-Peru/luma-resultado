export type CardType = 'CREDIT' | 'DEBIT';
export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'CANCELLED';

export interface Card {
  id: string;
  maskedNumber: string;
  last4: string;
  brand: string;
  type: CardType;
  status: CardStatus;
  holderName: string;
  creditLimit: number | null;
  availableBalance: number;
  currency: string;
}

export const STATUS_LABELS: Record<CardStatus, string> = {
  ACTIVE: 'Activa',
  BLOCKED: 'Bloqueada',
  CANCELLED: 'Cancelada',
};

export const TYPE_LABELS: Record<CardType, string> = {
  CREDIT: 'Crédito',
  DEBIT: 'Débito',
};

export function formatAmount(value: number, currency: string): string {
  return new Intl.NumberFormat('es-EC', { style: 'currency', currency }).format(value);
}
