import type { AccountNotification } from '../../api/types';
import { NotificationItem } from '../molecules/NotificationItem';

interface NotificationListProps {
  items: AccountNotification[];
  onMarkRead: (id: string) => void;
}

export function NotificationList({ items, onMarkRead }: NotificationListProps) {
  if (items.length === 0) {
    return <p className="empty">No tienes notificaciones.</p>;
  }
  return (
    <ul className="notification-list">
      {items.map((item) => (
        <NotificationItem key={item.id} notification={item} onMarkRead={onMarkRead} />
      ))}
    </ul>
  );
}
