import type { AccountNotification, RemoteState } from "../../types/notifications";
import { NotificationItem } from "../molecules/NotificationItem";

interface NotificationListProps {
  items: AccountNotification[];
  state: RemoteState;
  onMarkRead: (id: string) => void;
}

export function NotificationList({ items, state, onMarkRead }: NotificationListProps) {
  if (state === "loading" || state === "idle") {
    return <p role="status">Cargando notificaciones…</p>;
  }
  if (state === "error") {
    return <p role="alert">No se pudieron cargar las notificaciones.</p>;
  }
  if (items.length === 0) {
    return <p role="status">No tienes notificaciones.</p>;
  }
  return (
    <ul className="notification-list" aria-live="polite" aria-label="Notificaciones">
      {items.map((n) => (
        <NotificationItem key={n.id} notification={n} onMarkRead={onMarkRead} />
      ))}
    </ul>
  );
}
