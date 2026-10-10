import type { NotificationDto, NotificationType } from "../api/types";
import { Badge, type BadgeTone } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Icon, type IconName } from "../atoms/Icon";

const TYPE_META: Record<NotificationType, { label: string; tone: BadgeTone; icon: IconName }> = {
  PAYMENT_SUCCEEDED: { label: "Pago exitoso", tone: "success", icon: "check" },
  PAYMENT_FAILED: { label: "Pago fallido", tone: "danger", icon: "alert" },
  PAYMENT_SCHEDULED: { label: "Pago programado", tone: "info", icon: "clock" },
};

export function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(amount);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
}

interface NotificationItemProps {
  notification: NotificationDto;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const meta = TYPE_META[notification.type];
  const unread = notification.readAt === null;

  return (
    <li className={`notification${unread ? " notification--unread" : ""}`}>
      <Icon name={meta.icon} />
      <div className="notification__body">
        <div className="notification__head">
          <strong>{notification.title}</strong>
          <Badge tone={meta.tone}>{meta.label}</Badge>
        </div>
        <p>{notification.message}</p>
        <p className="notification__meta">
          <span className="amount">{formatAmount(notification.amount, notification.currency)}</span>
          <span>Cuenta •••• {notification.accountLast4}</span>
          <time dateTime={notification.createdAt}>{formatDate(notification.createdAt)}</time>
        </p>
      </div>
      {unread && (
        <Button
          variant="ghost"
          onClick={() => onMarkRead(notification.id)}
          aria-label={`Marcar como leída: ${notification.title}`}
        >
          Marcar como leída
        </Button>
      )}
    </li>
  );
}
