interface NotificationBellProps {
  unreadCount: number;
}

export function NotificationBell({ unreadCount }: NotificationBellProps) {
  return (
    <span className="bell" role="status" aria-live="polite">
      Notificaciones sin leer: {unreadCount}
    </span>
  );
}
