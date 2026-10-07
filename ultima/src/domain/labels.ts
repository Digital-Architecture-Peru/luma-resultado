import type { AccountStatus, AccountType } from './account';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger';

export const accountTypeLabels: Record<AccountType, string> = {
  SAVINGS: 'Ahorros',
  CHECKING: 'Corriente',
  TERM_DEPOSIT: 'Depósito a plazo',
};

export const accountStatusLabels: Record<AccountStatus, string> = {
  ACTIVE: 'Activa',
  BLOCKED: 'Bloqueada',
  CLOSED: 'Cerrada',
};

export const accountStatusTone: Record<AccountStatus, BadgeTone> = {
  ACTIVE: 'success',
  BLOCKED: 'warning',
  CLOSED: 'neutral',
};
