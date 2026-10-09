import { useCallback, useEffect, useState } from 'react';
import type { CardNotificationsApi } from '../api/cardNotificationsClient';
import type { NotificationFilter, NotificationPage } from '../api/types';

export type NotificationsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; page: NotificationPage };

export function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Error inesperado';
}

export function useNotifications(api: CardNotificationsApi, filter: NotificationFilter) {
  const [state, setState] = useState<NotificationsState>({ status: 'loading' });
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const page = await api.list(filter);
      setState({ status: 'success', page });
    } catch (error) {
      setState({ status: 'error', message: toMessage(error) });
    }
  }, [api, filter]);

  useEffect(() => {
    setState({ status: 'loading' });
    void load();
  }, [load]);

  const run = useCallback(
    async (action: () => Promise<unknown>) => {
      setActionError(null);
      try {
        await action();
        await load();
      } catch (error) {
        setActionError(toMessage(error));
      }
    },
    [load],
  );

  const markRead = useCallback((id: string) => run(() => api.markRead(id)), [api, run]);
  const markAllRead = useCallback(() => run(() => api.markAllRead()), [api, run]);

  return { state, actionError, markRead, markAllRead, reload: load };
}
