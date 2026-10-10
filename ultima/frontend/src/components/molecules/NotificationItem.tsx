import { Badge, type BadgeTone } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import type { NotificationType, PaymentNotification } from '../../types/notification';

const TYPE_LABELS: Record<NotificationType, { label: string; tone: BadgeTone }> = {
  PAYMENT_SUCCESS: { label: 'Pago exitoso', tone: 'success' },
  PAYMENT_FAILED: { label: 'Pago fallido', tone: 'danger' },
  PAYMENT_SCHEDULED: { label: 'Pago programado', tone: 'info' },
};

interface NotificationItemProps {
  notification: PaymentNotification;
  onMarkRead: (id: number) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const { label, tone } = TYPE_LABELS[notification.type];
  const unread = notification.status === 'UNREAD';
  const amount = new Intl.NumberFormat('es', {
    style: 'currency',
    currency: notification.currency,
  }).format(notification.amount);

  return (
    <li className={`notification ${unread ? 'notification--unread' : ''}`.trim()}>
      <div className="notification__body">
        <Badge tone={tone}>{label}</Badge>
        <p className="notification__amount">{amount}</p>
        <p className="notification__meta">
          Ref. {notification.paymentReference} · Cuenta {notification.maskedAccount}
        </p>
      </div>
      {unread ? (
        <Button onClick={() => onMarkRead(notification.id)}>
          Marcar como leída
          <span className="sr-only"> {notification.paymentReference}</span>
        </Button>
      ) : (
        <Badge tone="neutral">Leída</Badge>
      )}
    </li>
  );
}
