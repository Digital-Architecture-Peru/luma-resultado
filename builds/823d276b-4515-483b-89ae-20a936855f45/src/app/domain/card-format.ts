import { Card, CardStatus, CardType, CurrencyCode } from './card.model';

const STATUS_LABELS: Record<CardStatus, string> = {
  active: 'Activa',
  blocked: 'Bloqueada',
  expired: 'Vencida',
};

const TYPE_LABELS: Record<CardType, string> = {
  credit: 'Crédito',
  debit: 'Débito',
};

export function statusLabel(status: CardStatus): string {
  return STATUS_LABELS[status];
}

export function typeLabel(type: CardType): string {
  return TYPE_LABELS[type];
}

/** Enmascara el número: solo se muestran los últimos 4 dígitos. */
export function maskCardNumber(last4: string): string {
  if (!/^\d{4}$/.test(last4)) {
    throw new Error('last4 debe tener exactamente 4 dígitos');
  }
  return `•••• •••• •••• ${last4}`;
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(amount);
}

/** Porcentaje de línea utilizada (0-100); undefined si no es tarjeta con línea. */
export function creditUsagePercent(card: Card): number | undefined {
  if (card.type !== 'credit' || !card.creditLimit || card.creditLimit <= 0) {
    return undefined;
  }
  const used = card.creditLimit - card.availableBalance;
  const percent = Math.round((used / card.creditLimit) * 100);
  return Math.min(100, Math.max(0, percent));
}
