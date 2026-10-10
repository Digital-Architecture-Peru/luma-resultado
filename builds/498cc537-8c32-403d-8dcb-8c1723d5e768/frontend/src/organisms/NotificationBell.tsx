import { useState } from "react";
import type { NotificationDto } from "../api/types";
import { Badge } from "../atoms/Badge";
import { Icon } from "../atoms/Icon";
import type { LoadStatus } from "../hooks/useNotifications";
import { NotificationList } from "./NotificationList";

interface NotificationBellProps {
  items: NotificationDto[];
  unreadCount: number;
  status: LoadStatus;
  onMarkRead: (id: string) => void;
}

export function NotificationBell({ items, unreadCount, status, onMarkRead }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const label = unreadCount === 0 ? "Notificaciones" : `Notificaciones, ${unreadCount} sin leer`;

  return (
    <div className="bell">
      <button
        type="button"
        className="bell__trigger"
        aria-label={label}
        aria-expanded={open}
        aria-controls="notification-panel"
        onClick={() => setOpen((current) => !current)}
      >
        <Icon name="bell" />
        {unreadCount > 0 && <Badge tone="danger">{unreadCount > 99 ? "99+" : unreadCount}</Badge>}
      </button>
      {open && (
        <section id="notification-panel" className="bell__panel" aria-label="Panel de notificaciones">
          <NotificationList items={items} status={status} onMarkRead={onMarkRead} />
        </section>
      )}
    </div>
  );
}
