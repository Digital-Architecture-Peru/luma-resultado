import type { NotificationType, PaymentNotification } from '../../types/notification';
import { Badge, type BadgeTone } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { AmountText } from './AmountText';

const TYPE_LABEL: Record<NotificationType, { label: string; tone: BadgeTone }> = {
  PAYMENT_DONE: { label: 'Realizado', tone: 'success' },
  PAYMENT_REJECTED: { label: 'Rechazado', tone: 'danger' },
  PAYMENT_DUE: { label: 'Por vencer', tone: 'warning' },
};

interface NotificationItemProps {
  notification: PaymentNotification;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const { id, type, title, body, amount, currency, paymentRef, createdAt, readAt } = notification;
  const { label, tone } = TYPE_LABEL[type];
  const isUnread = readAt === null;

  return (
    <li className={`notification${isUnread ? ' notification--unread' : ''}`}>
      <div className="notification__head">
        <Badge tone={tone}>{label}</Badge>
        <h3 className="notification__title">{title}</h3>
        {isUnread && <span className="sr-only">No leída</span>}
      </div>
      <p className="notification__body">{body}</p>
      <p className="notification__meta">
        <AmountText amount={amount} currency={currency} /> · Pago {paymentRef} ·{' '}
        <time dateTime={createdAt}>{new Date(createdAt).toLocaleString('es-PE')}</time>
      </p>
      {isUnread && (
        <Button variant="ghost" onClick={() => onMarkRead(id)} aria-label={`Marcar como leída: ${title} ${paymentRef}`}>
          Marcar como leída
        </Button>
      )}
    </li>
  );
}
