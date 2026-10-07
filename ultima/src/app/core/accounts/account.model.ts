export type AccountType = 'ahorros' | 'corriente';
export type AccountStatus = 'activa' | 'bloqueada' | 'inactiva';

export interface Account {
  readonly id: string;
  readonly alias: string;
  /** Siempre enmascarado, p. ej. "•••• 1234". */
  readonly maskedNumber: string;
  readonly type: AccountType;
  readonly currency: string;
  readonly availableBalance: number;
  readonly status: AccountStatus;
}

export interface AccountsFilter {
  readonly type?: AccountType;
}
