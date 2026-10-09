import { useState } from 'react';
import type { CardNotificationsApi } from '../api/cardNotificationsClient';
import type { NotificationFilter } from '../api/types';
import { Button } from '../components/atoms/Button';
import { NotificationList } from '../components/organisms/NotificationList';
import { PreferencesPanel } from '../components/organisms/PreferencesPanel';
import { NotificationCenterTemplate } from '../components/templates/NotificationCenterTemplate';
import { useNotifications } from '../hooks/useNotifications';
import { usePreferences } from '../hooks/usePreferences';

export function NotificationsPage({ api }: { api: CardNotificationsApi }) {
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const notifications = useNotifications(api, filter);
  const preferences = usePreferences(api);

  const filterBar = (
    <div className="filter" role="group" aria-label="Filtrar notificaciones">
      <Button variant={filter === 'all' ? 'primary' : 'secondary'} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
        Todas
      </Button>
      <Button variant={filter === 'unread' ? 'primary' : 'secondary'} aria-pressed={filter === 'unread'} onClick={() => setFilter('unread')}>
        Sin leer
      </Button>
    </div>
  );

  const { state } = notifications;
  let list;
  if (state.status === 'loading') {
    list = <p role="status" className="card skeleton">Cargando notificaciones…</p>;
  } else if (state.status === 'error') {
    list = (
      <div role="alert" className="card error">
        <p>No se pudieron cargar las notificaciones: {state.message}</p>
        <Button variant="secondary" onClick={() => void notifications.reload()}>Reintentar</Button>
      </div>
    );
  } else {
    list = (
      <>
        {notifications.actionError ? <p role="alert" className="error">{notifications.actionError}</p> : null}
        <NotificationList
          items={state.page.items}
          unread={state.page.unread}
          onMarkRead={(id) => void notifications.markRead(id)}
          onMarkAllRead={() => void notifications.markAllRead()}
        />
      </>
    );
  }

  return (
    <NotificationCenterTemplate
      filter={filterBar}
      notifications={list}
      preferences={
        preferences.loading ? (
          <p role="status" className="card skeleton">Cargando preferencias…</p>
        ) : (
          <PreferencesPanel
            preferences={preferences.preferences}
            saving={preferences.saving}
            saved={preferences.saved}
            error={preferences.error}
            onToggle={preferences.toggle}
            onSave={() => void preferences.save()}
          />
        )
      }
    />
  );
}
