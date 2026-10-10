import { Button } from '../components/atoms/Button';
import { NotificationBell } from '../components/organisms/NotificationBell';
import { NotificationList } from '../components/organisms/NotificationList';
import { NotificationsTemplate } from '../components/templates/NotificationsTemplate';
import { useNotifications } from '../hooks/useNotifications';
import type { NotificationsApi } from '../services/notificationsApi';

interface NotificationsPageProps {
  api: NotificationsApi;
}

export function NotificationsPage({ api }: NotificationsPageProps) {
  const { items, unread, filter, status, setFilter, markAsRead, reload } = useNotifications(api);

  return (
    <NotificationsTemplate
      bell={<NotificationBell unread={unread} />}
      filters={
        <>
          <Button variant={filter === 'unread' ? 'primary' : 'ghost'} aria-pressed={filter === 'unread'} onClick={() => setFilter('unread')}>
            Sin leer
          </Button>
          <Button variant={filter === 'all' ? 'primary' : 'ghost'} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
            Todas
          </Button>
        </>
      }
    >
      <NotificationList items={items} status={status} onMarkRead={(id) => void markAsRead(id)} onRetry={reload} />
    </NotificationsTemplate>
  );
}
