import type { NotificationDto } from "../api/types";
import type { LoadStatus } from "../hooks/useNotifications";
import { NotificationItem } from "../molecules/NotificationItem";

interface NotificationListProps {
  items: NotificationDto[];
  status: LoadStatus;
  onMarkRead: (id: string) => void;
}

export function NotificationList({ items, status, onMarkRead }: NotificationListProps) {
  if (status === "error") {
    return <p role="alert">No se pudieron cargar las notificaciones. Se reintentará automáticamente.</p>;
  }
  if (status === "loading" || status === "idle") {
    return <p role="status">Cargando notificaciones…</p>;
  }
  if (items.length === 0) {
    return <p role="status">No tienes notificaciones nuevas.</p>;
  }
  return (
    <ul className="notification-list">
      {items.map((n) => (
        <NotificationItem key={n.id} notification={n} onMarkRead={onMarkRead} />
      ))}
    </ul>
  );
}
