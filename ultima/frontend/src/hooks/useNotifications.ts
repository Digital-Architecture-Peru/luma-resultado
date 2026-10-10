import { useCallback, useEffect, useState } from "react";
import { httpNotificationsApi, type NotificationsApi } from "../services/notificationsApi";
import type {
  AccountNotification,
  NotificationStatus,
  Preference,
  RemoteState,
} from "../types/notifications";

export function useNotifications(
  accountId: string,
  filter: NotificationStatus | undefined,
  api: NotificationsApi = httpNotificationsApi,
) {
  const [items, setItems] = useState<AccountNotification[]>([]);
  const [state, setState] = useState<RemoteState>("idle");

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    api
      .list(accountId, filter)
      .then((data) => {
        if (!cancelled) {
          setItems(data);
          setState("success");
        }
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [accountId, filter, api]);

  const markRead = useCallback(
    async (id: string) => {
      const updated = await api.markRead(id);
      setItems((current) =>
        filter === "UNREAD"
          ? current.filter((n) => n.id !== id)
          : current.map((n) => (n.id === id ? updated : n)),
      );
    },
    [api, filter],
  );

  return { items, state, markRead };
}

export function usePreferences(accountId: string, api: NotificationsApi = httpNotificationsApi) {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [state, setState] = useState<RemoteState>("idle");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    api
      .getPreferences(accountId)
      .then((data) => {
        if (!cancelled) {
          setPreferences(data);
          setState("success");
        }
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [accountId, api]);

  const save = useCallback(
    async (next: Preference[]) => {
      setSaved(false);
      setPreferences(await api.savePreferences(accountId, next));
      setSaved(true);
    },
    [accountId, api],
  );

  return { preferences, state, saved, save };
}
