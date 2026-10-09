import type { CardStatus, CardType } from "../types/card";

const LOCALE = "es-CL";

export function formatAmount(value: number, currency: string): string {
  return new Intl.NumberFormat(LOCALE, { style: "currency", currency }).format(value);
}

const STATUS_LABELS: Record<CardStatus, string> = {
  ACTIVE: "Activa",
  BLOCKED: "Bloqueada",
  EXPIRED: "Vencida",
};

const TYPE_LABELS: Record<CardType, string> = {
  CREDIT: "Crédito",
  DEBIT: "Débito",
};

export const statusLabel = (status: CardStatus): string => STATUS_LABELS[status];
export const typeLabel = (type: CardType): string => TYPE_LABELS[type];
