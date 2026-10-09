import type { CardNotification } from '../../api/types';
import { Button } from '../atoms/Button';
import { NotificationItem } from '../molecules/NotificationItem';

interface NotificationListProps {
  items: CardNotification[];
  unread: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function NotificationList({ items, unread, onMarkRead, onMarkAllRead }: NotificationListProps) {
  return (
    <section aria-labelledby="notifications-heading" className="card">
      <div className="card__header">
        <h2 id="notifications-heading">Mis notificaciones</h2>
        <p role="status" aria-live="polite" className="unread-count">
          {unread === 0 ? 'Todo al día' : `${unread} sin leer`}
        </p>
        <Button variant="secondary" disabled={unread === 0} onClick={onMarkAllRead}>
          Marcar todas como leídas
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="empty">No tienes notificaciones.</p>
      ) : (
        <ul className="notification-list">
          {items.map((item) => (
            <NotificationItem key={item.id} notification={item} onMarkRead={onMarkRead} />
          ))}
        </ul>
      )}
    </section>
  );
}
