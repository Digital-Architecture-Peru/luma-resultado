import type { PaymentStatus } from '../../types';

const LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  REJECTED: 'Rechazado',
};

export function statusLabel(status: PaymentStatus): string {
  return LABELS[status];
}

/** El estado se comunica con texto, no solo con color. */
export function StatusBadge({ status }: { status: PaymentStatus }) {
  return <span className={`badge badge--${status.toLowerCase()}`}>{statusLabel(status)}</span>;
}
