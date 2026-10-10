import { BellIcon } from '../atoms/Icon';

interface NotificationBellProps {
  unread: number;
}

export function NotificationBell({ unread }: NotificationBellProps) {
  return (
    <div className="bell" aria-live="polite">
      <BellIcon />
      <span className="bell__count" aria-label={`${unread} notificaciones sin leer`}>
        {unread}
      </span>
    </div>
  );
}
