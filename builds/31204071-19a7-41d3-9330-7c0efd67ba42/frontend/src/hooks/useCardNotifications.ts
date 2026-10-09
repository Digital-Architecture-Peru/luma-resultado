import { useCallback, useEffect, useState } from "react";
import { toMessage, type NotificationsApi } from "../api/notificationsClient";
import type { CardNotification, NotificationType, Page, Preference } from "../api/types";

export type RemoteState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

export function useNotificationList(
  api: NotificationsApi,
  cardId: string,
  unreadOnly: boolean,
  page: number,
  size: number,
) {
  const [state, setState] = useState<RemoteState<Page<CardNotification>>>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    api
      .listNotifications(cardId, { unreadOnly, page, size })
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ status: "error", message: toMessage(error) });
      });
    return () => {
      cancelled = true;
    };
  }, [api, cardId, unreadOnly, page, size, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const replaceItem = useCallback((updated: CardNotification) => {
    setState((previous) =>
      previous.status === "success"
        ? {
            status: "success",
            data: {
              ...previous.data,
              items: previous.data.items.map((item) => (item.id === updated.id ? updated : item)),
            },
          }
        : previous,
    );
  }, []);

  return { state, reload, replaceItem };
}

export function usePreferences(api: NotificationsApi, cardId: string) {
  const [state, setState] = useState<RemoteState<Preference[]>>({ status: "loading" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    setSaveError(null);
    api
      .getPreferences(cardId)
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ status: "error", message: toMessage(error) });
      });
    return () => {
      cancelled = true;
    };
  }, [api, cardId]);

  const toggle = useCallback(
    async (type: NotificationType, enabled: boolean) => {
      if (state.status !== "success") return;
      const next = state.data.map((preference) =>
        preference.type === type ? { ...preference, enabled } : preference,
      );
      setSaving(true);
      setSaveError(null);
      try {
        setState({ status: "success", data: await api.updatePreferences(cardId, next) });
      } catch (error: unknown) {
        setSaveError(toMessage(error));
      } finally {
        setSaving(false);
      }
    },
    [api, cardId, state],
  );

  return { state, saving, saveError, toggle };
}
