import { useCallback, useEffect, useState } from 'react';
import type { NotificationsApi } from '../services/notificationsApi';
import type { PaymentNotification } from '../types/notification';

export type LoadState = 'loading' | 'success' | 'error';

export interface UseNotifications {
  items: PaymentNotification[];
  state: LoadState;
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNotifications(api: NotificationsApi, pollMs: number): UseNotifications {
  const [items, setItems] = useState<PaymentNotification[]>([]);
  const [state, setState] = useState<LoadState>('loading');

  const refresh = useCallback(async () => {
    try {
      setItems(await api.list());
      setState('success');
    } catch {
      setState('error');
    }
  }, [api]);

  useEffect(() => {
    void refresh();
    if (pollMs <= 0) {
      return undefined;
    }
    const timer = setInterval(() => void refresh(), pollMs);
    return () => clearInterval(timer);
  }, [refresh, pollMs]);

  const markAsRead = useCallback(
    async (id: number) => {
      try {
        const updated = await api.markAsRead(id);
        setItems((current) => current.map((n) => (n.id === id ? updated : n)));
      } catch {
        setState('error');
      }
    },
    [api],
  );

  const unreadCount = items.filter((n) => n.status === 'UNREAD').length;
  return { items, state, unreadCount, markAsRead, refresh };
}
