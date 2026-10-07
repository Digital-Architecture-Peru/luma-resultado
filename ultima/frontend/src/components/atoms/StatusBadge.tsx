import type { CardStatus } from "../../types/card";

const LABELS: Record<CardStatus, string> = {
  ACTIVE: "Activa",
  BLOCKED: "Bloqueada",
  EXPIRED: "Vencida",
};

interface StatusBadgeProps {
  status: CardStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`badge badge--${status.toLowerCase()}`}>{LABELS[status]}</span>;
}
