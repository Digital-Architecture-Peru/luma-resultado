import type { CardStatus } from "../../types/card";

const LABELS: Record<CardStatus, string> = {
  ACTIVE: "Activa",
  BLOCKED: "Bloqueada",
  CANCELLED: "Cancelada",
};

export function StatusBadge({ status }: { status: CardStatus }) {
  return <span className={`badge badge--${status.toLowerCase()}`}>{LABELS[status]}</span>;
}
