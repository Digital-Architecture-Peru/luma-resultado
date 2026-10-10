import type { AccountNotification } from "../../types/notifications";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";

interface NotificationItemProps {
  notification: AccountNotification;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const unread = notification.status === "UNREAD";
  return (
    <li className={`notification ${unread ? "notification--unread" : ""}`.trim()}>
      <div className="notification__head">
        <Badge type={notification.type} />
        <time dateTime={notification.createdAt}>
          {new Date(notification.createdAt).toLocaleString("es")}
        </time>
      </div>
      <h3>{notification.title}</h3>
      <p>{notification.message}</p>
      {unread ? (
        <Button variant="ghost" onClick={() => onMarkRead(notification.id)}>
          Marcar como leída
        </Button>
      ) : (
        <span className="muted">Leída</span>
      )}
    </li>
  );
}
