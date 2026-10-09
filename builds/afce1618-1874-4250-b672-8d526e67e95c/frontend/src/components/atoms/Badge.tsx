import type { AccountStatus } from "../../types/account";

const LABELS: Record<AccountStatus, string> = {
  ACTIVE: "Activa",
  BLOCKED: "Bloqueada",
  CLOSED: "Cerrada",
};

export function Badge({ status }: { status: AccountStatus }) {
  return <span className={`badge badge--${status.toLowerCase()}`}>{LABELS[status]}</span>;
}
