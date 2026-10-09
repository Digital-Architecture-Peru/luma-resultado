import type { PaymentStatus } from '../../api/types';
import { STATUS_LABELS } from '../../utils/format';

/** El estado se comunica con texto, no solo con color. */
export function StatusBadge({ status }: { status: PaymentStatus }) {
  return <span className={`badge badge--${status.toLowerCase()}`}>{STATUS_LABELS[status]}</span>;
}
