import type { PaymentNotification } from '../../types/notification';
import { NotificationItem } from '../molecules/NotificationItem';

interface NotificationListProps {
  items: PaymentNotification[];
  onMarkRead: (id: number) => void;
}

export function NotificationList({ items, onMarkRead }: NotificationListProps) {
  if (items.length === 0) {
    return <p className="empty">No tienes notificaciones de pagos.</p>;
  }
  return (
    <ul className="notification-list">
      {items.map((n) => (
        <NotificationItem key={n.id} notification={n} onMarkRead={onMarkRead} />
      ))}
    </ul>
  );
}
