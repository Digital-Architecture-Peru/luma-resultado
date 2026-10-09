export type AccountType = 'AHORROS' | 'CORRIENTE' | 'PLAZO_FIJO';
export type AccountStatus = 'ACTIVA' | 'BLOQUEADA' | 'INACTIVA';
export type CurrencyCode = 'PEN' | 'USD';

export interface Account {
  readonly id: string;
  readonly alias: string;
  readonly type: AccountType;
  readonly maskedNumber: string;
  readonly currency: CurrencyCode;
  readonly balance: number;
  readonly available: number;
  readonly status: AccountStatus;
}

export type AccountTypeFilter = AccountType | 'TODAS';

export interface CurrencyTotal {
  readonly currency: CurrencyCode;
  readonly balance: number;
  readonly available: number;
}
