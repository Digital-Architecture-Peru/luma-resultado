import { NotificationBell } from '../components/organisms/NotificationBell';
import { NotificationList } from '../components/organisms/NotificationList';
import { NotificationsPanelTemplate } from '../components/templates/NotificationsPanelTemplate';
import { useNotifications } from '../hooks/useNotifications';
import { notificationsApi, type NotificationsApi } from '../services/notificationsApi';

const DEFAULT_POLL_MS = 30000;

interface NotificationsPageProps {
  api?: NotificationsApi;
  pollMs?: number;
}

export function NotificationsPage({
  api = notificationsApi,
  pollMs = Number(import.meta.env.VITE_POLL_MS ?? DEFAULT_POLL_MS),
}: NotificationsPageProps) {
  const { items, state, unreadCount, markAsRead, refresh } = useNotifications(api, pollMs);

  return (
    <NotificationsPanelTemplate
      title="Notificaciones de pagos"
      bell={<NotificationBell unreadCount={unreadCount} />}
    >
      {state === 'loading' && <p className="skeleton">Cargando notificaciones…</p>}
      {state === 'error' && (
        <div className="error" role="alert">
          <p>No se pudieron cargar las notificaciones.</p>
          <button type="button" className="btn" onClick={() => void refresh()}>
            Reintentar
          </button>
        </div>
      )}
      {state === 'success' && (
        <NotificationList items={items} onMarkRead={(id) => void markAsRead(id)} />
      )}
    </NotificationsPanelTemplate>
  );
}
