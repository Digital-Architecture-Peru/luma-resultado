import type { PaymentStatus } from '../api/types';

export const STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  REJECTED: 'Rechazado',
};

/** Agrupa miles sin convertir a number (conserva la precisión del string decimal). */
export function formatAmount(amount: string, currency: string): string {
  const [integer = '0', fraction] = amount.split('.');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${grouped}${fraction ? `.${fraction}` : ''} ${currency}`;
}

export function formatDate(iso: string): string {
  return iso.slice(0, 10);
}
