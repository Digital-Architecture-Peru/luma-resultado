import type { AccountNotification } from '../../api/types';
import { formatDate, typeInfo } from '../../lib/format';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';

interface NotificationItemProps {
  notification: AccountNotification;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const info = typeInfo(notification.type);
  return (
    <li className={`notification ${notification.isRead ? 'notification--read' : 'notification--unread'}`}>
      <div className="notification__head">
        <Badge tone={info.tone}>{info.label}</Badge>
        <span className="notification__account">Cuenta {notification.accountMasked}</span>
        <time dateTime={notification.createdAt}>{formatDate(notification.createdAt)}</time>
      </div>
      <h3 className="notification__title">{notification.title}</h3>
      <p>{notification.message}</p>
      {notification.isRead ? (
        <span className="notification__state">Leída</span>
      ) : (
        <Button variant="ghost" onClick={() => onMarkRead(notification.id)}>
          Marcar como leída
        </Button>
      )}
    </li>
  );
}
