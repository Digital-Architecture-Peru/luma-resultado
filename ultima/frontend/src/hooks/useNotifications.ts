import { useCallback, useEffect, useState } from "react";
import type { NotificationDto, NotificationsApi } from "../api/types";

export type LoadStatus = "idle" | "loading" | "success" | "error";

export const POLL_INTERVAL_MS = 30_000;

export interface UseNotifications {
  items: NotificationDto[];
  unreadCount: number;
  status: LoadStatus;
  markRead: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

/** Consulta periódica (polling) de notificaciones no leídas; ver AD4. */
export function useNotifications(api: NotificationsApi, intervalMs: number = POLL_INTERVAL_MS): UseNotifications {
  const [items, setItems] = useState<NotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [status, setStatus] = useState<LoadStatus>("idle");

  const refresh = useCallback(async () => {
    setStatus((current) => (current === "success" ? current : "loading"));
    try {
      const [list, count] = await Promise.all([api.list("unread"), api.unreadCount()]);
      setItems(list);
      setUnreadCount(count);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, [api]);

  const markRead = useCallback(
    async (id: string) => {
      try {
        await api.markRead(id);
        setItems((current) => current.filter((n) => n.id !== id));
        setUnreadCount((current) => Math.max(0, current - 1));
      } catch {
        setStatus("error");
      }
    },
    [api],
  );

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => void refresh(), intervalMs);
    return () => clearInterval(timer);
  }, [refresh, intervalMs]);

  return { items, unreadCount, status, markRead, refresh };
}
