import { NotificationType } from './models';

const TYPE_LABELS: Record<NotificationType, string> = {
  DEPOSIT: 'Depósito',
  WITHDRAWAL: 'Retiro',
  LOW_BALANCE: 'Saldo bajo',
};

export function typeLabel(type: NotificationType): string {
  return TYPE_LABELS[type];
}

export function formatAmount(amount: number | null, currency: string | null): string | null {
  if (amount === null || currency === null) {
    return null;
  }
  return new Intl.NumberFormat('es', { style: 'currency', currency }).format(amount);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' });
}
