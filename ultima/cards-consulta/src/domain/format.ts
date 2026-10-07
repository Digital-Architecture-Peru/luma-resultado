import type { CardStatus } from './card';

/** Devuelve "•••• 1234". Si last4 no son 4 dígitos, no expone nada. */
export function maskCardNumber(last4: string): string {
  return /^\d{4}$/.test(last4) ? `•••• ${last4}` : '•••• ····';
}

export function formatMoney(amount: number, currency: string, locale = 'es'): string {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    // Código de moneda inválido: mostrar número con el código tal cual.
    return `${amount.toFixed(2)} ${currency}`;
  }
}

const STATUS_LABELS: Record<CardStatus, string> = {
  ACTIVE: 'Activa',
  BLOCKED: 'Bloqueada',
  EXPIRED: 'Vencida',
};

export function statusLabel(status: CardStatus): string {
  return STATUS_LABELS[status] ?? 'Desconocido';
}
