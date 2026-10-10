import { useCallback, useEffect, useState } from 'react';
import type { NotificationsApi } from '../services/notificationsApi';
import type { NotificationFilter, PaymentNotification } from '../types/notification';

export type LoadStatus = 'loading' | 'success' | 'error';

export interface NotificationsState {
  items: PaymentNotification[];
  unread: number;
  filter: NotificationFilter;
  status: LoadStatus;
  setFilter: (filter: NotificationFilter) => void;
  markAsRead: (id: string) => Promise<void>;
  reload: () => void;
}

export function useNotifications(api: NotificationsApi): NotificationsState {
  const [items, setItems] = useState<PaymentNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [filter, setFilter] = useState<NotificationFilter>('unread');
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    Promise.all([api.list(filter), api.unreadCount()])
      .then(([page, count]) => {
        if (cancelled) return;
        setItems(page.items);
        setUnread(count);
        setStatus('success');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [api, filter, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        await api.markAsRead(id);
        reload();
      } catch {
        setStatus('error');
      }
    },
    [api, reload],
  );

  return { items, unread, filter, status, setFilter, markAsRead, reload };
}
