import type { TransactionStatus } from '../../domain/types';

const LABELS: Record<TransactionStatus, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
};

export function StatusBadge({ status }: { status: TransactionStatus }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{LABELS[status]}</span>;
}
