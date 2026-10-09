import type { CardNotification } from '../../api/types';
import { formatDate, maskedCard } from '../../model/notifications';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';

interface NotificationItemProps {
  notification: CardNotification;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const unread = notification.readAt === null;
  return (
    <li className={`notification${unread ? ' notification--unread' : ''}`}>
      <div className="notification__head">
        <Badge severity={notification.severity} />
        <span className="notification__card">{maskedCard(notification.cardLast4)}</span>
        <time className="notification__time" dateTime={notification.createdAt}>
          {formatDate(notification.createdAt)}
        </time>
      </div>
      <h3 className="notification__title">
        {notification.title}
        {unread ? <span className="visually-hidden"> (sin leer)</span> : null}
      </h3>
      <p className="notification__body">{notification.body}</p>
      {unread ? (
        <Button variant="ghost" onClick={() => onMarkRead(notification.id)}>
          Marcar como leída
        </Button>
      ) : null}
    </li>
  );
}
