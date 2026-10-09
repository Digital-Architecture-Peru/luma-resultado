import { useCallback, useEffect, useState } from 'react';
import { messageOf, type NotificationsApi } from '../services/notificationsApi';
import type { CardNotification } from '../types/notification';

export type RemoteStatus = 'idle' | 'loading' | 'success' | 'error';

interface State {
  status: RemoteStatus;
  items: CardNotification[];
  error: string | null;
}

const PAGE_SIZE = 20;

export function useNotifications(api: NotificationsApi, cardId: string | null) {
  const [state, setState] = useState<State>({ status: 'idle', items: [], error: null });
  const [onlyUnread, setOnlyUnread] = useState(false);

  const load = useCallback(async () => {
    if (!cardId) {
      return;
    }
    setState((s) => ({ ...s, status: 'loading', error: null }));
    try {
      const page = await api.listNotifications(cardId, onlyUnread ? 'UNREAD' : undefined, 0, PAGE_SIZE);
      setState({ status: 'success', items: page.items, error: null });
    } catch (error) {
      setState({ status: 'error', items: [], error: messageOf(error) });
    }
  }, [api, cardId, onlyUnread]);

  useEffect(() => {
    void load();
  }, [load]);

  const markRead = useCallback(
    async (id: string) => {
      try {
        const updated = await api.markRead(id);
        setState((s) => ({
          ...s,
          items: onlyUnread ? s.items.filter((n) => n.id !== id) : s.items.map((n) => (n.id === id ? updated : n)),
        }));
      } catch (error) {
        setState((s) => ({ ...s, error: messageOf(error) }));
      }
    },
    [api, onlyUnread],
  );

  return { ...state, onlyUnread, setOnlyUnread, reload: load, markRead };
}
