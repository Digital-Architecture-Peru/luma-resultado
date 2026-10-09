import { STATUS_LABELS, type AccountStatus } from "../../domain/account";

export function StatusBadge({ status }: { status: AccountStatus }) {
  return <span className={`badge badge--${status.toLowerCase()}`}>{STATUS_LABELS[status]}</span>;
}
