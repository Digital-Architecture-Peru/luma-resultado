import { useState } from "react";
import { Button } from "../components/atoms/Button";
import { NotificationList } from "../components/organisms/NotificationList";
import { PreferencesForm } from "../components/organisms/PreferencesForm";
import { NotificationsLayout } from "../components/templates/NotificationsLayout";
import { useNotifications, usePreferences } from "../hooks/useNotifications";
import { httpNotificationsApi, type NotificationsApi } from "../services/notificationsApi";
import type { NotificationStatus } from "../types/notifications";

interface NotificationsPageProps {
  accountId: string;
  api?: NotificationsApi;
}

export function NotificationsPage({ accountId, api = httpNotificationsApi }: NotificationsPageProps) {
  const [filter, setFilter] = useState<NotificationStatus | undefined>(undefined);
  const notifications = useNotifications(accountId, filter, api);
  const prefs = usePreferences(accountId, api);

  return (
    <NotificationsLayout
      title="Notificaciones de la cuenta"
      toolbar={
        <div role="group" aria-label="Filtro">
          <Button variant={filter === undefined ? "primary" : "ghost"} onClick={() => setFilter(undefined)}>
            Todas
          </Button>
          <Button variant={filter === "UNREAD" ? "primary" : "ghost"} onClick={() => setFilter("UNREAD")}>
            No leídas
          </Button>
        </div>
      }
      main={
        <NotificationList
          items={notifications.items}
          state={notifications.state}
          onMarkRead={(id) => void notifications.markRead(id)}
        />
      }
      aside={
        <PreferencesForm
          preferences={prefs.preferences}
          state={prefs.state}
          saved={prefs.saved}
          onSave={(next) => void prefs.save(next)}
        />
      }
    />
  );
}
