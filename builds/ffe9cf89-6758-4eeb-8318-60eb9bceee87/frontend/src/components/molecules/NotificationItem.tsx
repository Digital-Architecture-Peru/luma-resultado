import type { CardNotification, NotificationType } from '../../types/notification';
import { TYPE_LABELS } from '../../types/notification';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';

interface NotificationItemProps {
  notification: CardNotification;
  onMarkRead: (id: string) => void;
}

const TONES: Record<NotificationType, 'neutral' | 'info' | 'success' | 'danger'> = {
  COMPRA: 'info',
  PAGO: 'success',
  VENCIMIENTO: 'neutral',
  BLOQUEO: 'danger',
};

function formatAmount(amount: number | null, currency: string | null): string | null {
  if (amount === null || currency === null) {
    return null;
  }
  return new Intl.NumberFormat('es', { style: 'currency', currency }).format(amount);
}

export default function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const unread = notification.status === 'UNREAD';
  const amount = formatAmount(notification.amount, notification.currency);
  return (
    <li className={`notification${unread ? ' notification--unread' : ''}`}>
      <div className="notification__head">
        <Badge tone={TONES[notification.type]}>{TYPE_LABELS[notification.type]}</Badge>
        <span className="notification__state">{unread ? 'No leída' : 'Leída'}</span>
      </div>
      <h3 className="notification__title">{notification.title}</h3>
      <p className="notification__message">{notification.message}</p>
      <div className="notification__foot">
        {amount && <strong className="notification__amount">{amount}</strong>}
        <time dateTime={notification.createdAt}>{new Date(notification.createdAt).toLocaleString('es')}</time>
        {unread && (
          <Button variant="ghost" aria-label={`Marcar como leída: ${notification.title}`} onClick={() => onMarkRead(notification.id)}>
            Marcar como leída
          </Button>
        )}
      </div>
    </li>
  );
}
