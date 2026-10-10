import type { NotificationType } from "../../types/notifications";
import { TYPE_LABELS } from "../../types/notifications";

export function Badge({ type }: { type: NotificationType }) {
  return <span className={`badge badge--${type.toLowerCase()}`}>{TYPE_LABELS[type]}</span>;
}
