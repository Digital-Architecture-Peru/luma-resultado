import type { RemoteStatus } from '../../hooks/useNotifications';
import type { CardNotification } from '../../types/notification';
import NotificationItem from '../molecules/NotificationItem';

interface NotificationListProps {
  status: RemoteStatus;
  items: CardNotification[];
  error: string | null;
  onMarkRead: (id: string) => void;
}

export default function NotificationList({ status, items, error, onMarkRead }: NotificationListProps) {
  return (
    <section aria-labelledby="notifications-heading">
      <h2 id="notifications-heading">Notificaciones</h2>
      {error && <p role="alert" className="feedback feedback--error">{error}</p>}
      {status === 'loading' && <p role="status" className="feedback">Cargando notificaciones…</p>}
      {status === 'success' && items.length === 0 && <p className="feedback">No hay notificaciones.</p>}
      <ul className="notification-list">
        {items.map((n) => (
          <NotificationItem key={n.id} notification={n} onMarkRead={onMarkRead} />
        ))}
      </ul>
    </section>
  );
}
