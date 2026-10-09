import type { CardNotification } from "../../api/types";
import { TYPE_META, formatAmount, formatDateTime } from "../../domain/notificationMeta";
import { Badge } from "../atoms/Badge";
import { Icon } from "../atoms/Icon";

interface NotificationItemProps {
  notification: CardNotification;
  busy?: boolean;
  onMarkRead: (id: string) => void;
}

/** Molécula: una notificación con su tipo, monto, fecha y acción de marcar como leída. */
export function NotificationItem({ notification, busy = false, onMarkRead }: NotificationItemProps) {
  const meta = TYPE_META[notification.type];
  const className = notification.read ? "notification" : "notification notification--unread";

  return (
    <article className={className} aria-label={`${notification.title}, tarjeta terminada en ${notification.cardLast4}`}>
      <div className="notification__icon">
        <Icon name={meta.icon} />
      </div>
      <div className="notification__body">
        <header className="notification__header">
          <h3 className="notification__title">{notification.title}</h3>
          <Badge tone={meta.tone}>{meta.label}</Badge>
          {!notification.read && <Badge tone="success">No leída</Badge>}
        </header>
        <p className="notification__message">{notification.message}</p>
        <p className="notification__meta">
          {notification.amount !== null && (
            <span className="notification__amount">{formatAmount(notification.amount, notification.currency)}</span>
          )}
          <time dateTime={notification.createdAt}>{formatDateTime(notification.createdAt)}</time>
        </p>
      </div>
      {!notification.read && (
        <button type="button" className="button button--ghost" disabled={busy} onClick={() => onMarkRead(notification.id)}>
          Marcar como leída
        </button>
      )}
    </article>
  );
}
