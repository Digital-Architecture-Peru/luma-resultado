import type { NotificationType } from '../api/types';
import type { BadgeTone } from '../components/atoms/Badge';

interface TypeInfo {
  label: string;
  tone: BadgeTone;
}

const TYPE_INFO: Record<NotificationType, TypeInfo> = {
  DEPOSIT: { label: 'Depósito', tone: 'success' },
  WITHDRAWAL: { label: 'Retiro', tone: 'info' },
  LOW_BALANCE: { label: 'Saldo bajo', tone: 'warning' },
  STATEMENT: { label: 'Estado de cuenta', tone: 'neutral' },
};

export function typeInfo(type: NotificationType): TypeInfo {
  return TYPE_INFO[type];
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString('es');
}
