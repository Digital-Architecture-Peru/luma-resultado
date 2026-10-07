/** Tipos de cuenta ilustrativos (no catalogo oficial). */
export const ACCOUNT_TYPES = ['SAVINGS', 'CHECKING', 'TERM_DEPOSIT'] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const ACCOUNT_STATUSES = ['ACTIVE', 'BLOCKED', 'CLOSED'] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

/** Valor del filtro de tipo en la UI: un tipo concreto o todos. */
export type AccountTypeOption = AccountType | 'ALL';

export interface Account {
  readonly id: string;
  /** Numero completo. Solo debe mostrarse enmascarado (ver domain/format.ts). */
  readonly number: string;
  readonly type: AccountType;
  readonly alias: string;
  readonly holderName: string;
  /** Codigo ISO 4217, p. ej. USD. */
  readonly currency: string;
  /** Saldos en unidades menores (enteros) para evitar errores de punto flotante. */
  readonly balanceMinor: number;
  readonly availableMinor: number;
  readonly status: AccountStatus;
  /** Fecha ISO (YYYY-MM-DD). */
  readonly openedAt: string;
}

export interface AccountFilter {
  readonly type?: AccountTypeOption;
}

export function isAccountTypeOption(value: unknown): value is AccountTypeOption {
  return value === 'ALL' || (ACCOUNT_TYPES as readonly unknown[]).includes(value);
}
