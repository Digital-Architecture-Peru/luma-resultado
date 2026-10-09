import type { CardNotification } from "../../api/types";
import type { RemoteState } from "../../hooks/useCardNotifications";
import { NotificationItem } from "../molecules/NotificationItem";

interface NotificationListProps {
  items: RemoteState<CardNotification[]>;
  pendingId: string | null;
  emptyMessage: string;
  onMarkRead: (id: string) => void;
  onRetry: () => void;
}

/** Organismo: lista de notificaciones con estados de carga, error y vacío. */
export function NotificationList({ items, pendingId, emptyMessage, onMarkRead, onRetry }: NotificationListProps) {
  if (items.status === "loading") {
    return (
      <p role="status" className="state state--loading">
        Cargando notificaciones…
      </p>
    );
  }
  if (items.status === "error") {
    return (
      <div role="alert" className="state state--error">
        <p>{items.message}</p>
        <button type="button" className="button button--secondary" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    );
  }
  if (items.data.length === 0) {
    return <p className="state state--empty">{emptyMessage}</p>;
  }
  return (
    <ul className="notification-list">
      {items.data.map((notification) => (
        <li key={notification.id}>
          <NotificationItem
            notification={notification}
            busy={pendingId === notification.id}
            onMarkRead={onMarkRead}
          />
        </li>
      ))}
    </ul>
  );
}
