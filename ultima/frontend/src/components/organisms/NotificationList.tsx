import type { LoadStatus } from '../../hooks/useNotifications';
import type { PaymentNotification } from '../../types/notification';
import { Button } from '../atoms/Button';
import { NotificationItem } from '../molecules/NotificationItem';

interface NotificationListProps {
  items: PaymentNotification[];
  status: LoadStatus;
  onMarkRead: (id: string) => void;
  onRetry: () => void;
}

export function NotificationList({ items, status, onMarkRead, onRetry }: NotificationListProps) {
  if (status === 'loading') {
    return <p role="status">Cargando notificaciones…</p>;
  }

  if (status === 'error') {
    return (
      <div role="alert" className="state state--error">
        <p>No pudimos cargar tus notificaciones.</p>
        <Button onClick={onRetry}>Reintentar</Button>
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="state">No tienes notificaciones para mostrar.</p>;
  }

  return (
    <ul className="notification-list">
      {items.map((n) => (
        <NotificationItem key={n.id} notification={n} onMarkRead={onMarkRead} />
      ))}
    </ul>
  );
}
