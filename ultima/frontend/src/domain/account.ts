export type AccountType = "SAVINGS" | "CHECKING" | "TERM_DEPOSIT";
export type AccountStatus = "ACTIVE" | "BLOCKED" | "CLOSED";

export interface Account {
  id: string;
  maskedNumber: string;
  type: AccountType;
  currency: "PEN" | "USD";
  /** Decimal como texto para evitar errores de punto flotante. */
  balance: string;
  status: AccountStatus;
  updatedAt: string;
}

export interface AccountPage {
  items: Account[];
  page: number;
  size: number;
  total: number;
}

export const TYPE_LABELS: Record<AccountType, string> = {
  SAVINGS: "Ahorros",
  CHECKING: "Corriente",
  TERM_DEPOSIT: "Depósito a plazo",
};

export const STATUS_LABELS: Record<AccountStatus, string> = {
  ACTIVE: "Activa",
  BLOCKED: "Bloqueada",
  CLOSED: "Cerrada",
};
