import type { NotificationType } from "../api/types";

export type Tone = "info" | "warning" | "danger" | "success";
export type IconName = "cart" | "calendar" | "lock" | "gauge";

export interface TypeMeta {
  label: string;
  description: string;
  tone: Tone;
  icon: IconName;
}

export const TYPE_META: Record<NotificationType, TypeMeta> = {
  PURCHASE: { label: "Compras", description: "Aviso por cada compra aprobada.", tone: "info", icon: "cart" },
  PAYMENT_DUE: {
    label: "Pagos",
    description: "Recordatorio de fechas de pago.",
    tone: "warning",
    icon: "calendar",
  },
  CARD_BLOCKED: {
    label: "Bloqueos",
    description: "Aviso cuando la tarjeta se bloquea o desbloquea.",
    tone: "danger",
    icon: "lock",
  },
  LIMIT_REACHED: {
    label: "Límite de línea",
    description: "Aviso al acercarte al límite de tu línea.",
    tone: "warning",
    icon: "gauge",
  },
};

export function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(amount);
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}
