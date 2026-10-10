import { useCallback, useEffect, useState } from 'react';
import { notificationsApi } from '../api/notificationsApi';
import type { AccountNotification, NotificationsApi } from '../api/types';
import { Button } from '../components/atoms/Button';
import { NotificationBell } from '../components/organisms/NotificationBell';
import { NotificationList } from '../components/organisms/NotificationList';
import { NotificationsLayout } from '../components/templates/NotificationsLayout';

interface NotificationsPageProps {
  accountId: string;
  api?: NotificationsApi;
}

type LoadState = 'loading' | 'ready' | 'error';

export function NotificationsPage({ accountId, api = notificationsApi }: NotificationsPageProps) {
  const [items, setItems] = useState<AccountNotification[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    api
      .list(accountId, unreadOnly)
      .then((result) => {
        if (!cancelled) {
          setItems(result);
          setState('ready');
        }
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [api, accountId, unreadOnly]);

  const markRead = useCallback(
    (id: string) => {
      setActionError(null);
      api
        .markRead(id)
        .then(() => {
          const readAt = new Date().toISOString();
          setItems((current) =>
            current
              .map((n) => (n.id === id ? { ...n, isRead: true, readAt } : n))
              .filter((n) => !unreadOnly || !n.isRead),
          );
        })
        .catch(() => setActionError('No se pudo marcar la notificación como leída.'));
    },
    [api, unreadOnly],
  );

  const unreadCount = items.filter((n) => !n.isRead).length;

  return (
    <NotificationsLayout
      title="Notificaciones de tus cuentas"
      bell={<NotificationBell unreadCount={unreadCount} />}
      toolbar={
        <Button variant="ghost" pressed={unreadOnly} onClick={() => setUnreadOnly((v) => !v)}>
          Solo sin leer
        </Button>
      }
    >
      {actionError && <p role="alert" className="error">{actionError}</p>}
      {state === 'loading' && <p className="empty">Cargando notificaciones…</p>}
      {state === 'error' && <p role="alert" className="error">No se pudieron cargar las notificaciones.</p>}
      {state === 'ready' && <NotificationList items={items} onMarkRead={markRead} />}
    </NotificationsLayout>
  );
}
