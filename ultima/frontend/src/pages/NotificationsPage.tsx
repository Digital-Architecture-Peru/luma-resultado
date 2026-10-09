import { useEffect, useState } from 'react';
import NotificationList from '../components/organisms/NotificationList';
import PreferencesPanel from '../components/organisms/PreferencesPanel';
import NotificationsTemplate from '../components/templates/NotificationsTemplate';
import { useNotifications } from '../hooks/useNotifications';
import { usePreferences } from '../hooks/usePreferences';
import { messageOf, type NotificationsApi } from '../services/notificationsApi';
import type { Card } from '../types/notification';

interface NotificationsPageProps {
  api: NotificationsApi;
}

export default function NotificationsPage({ api }: NotificationsPageProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [cardId, setCardId] = useState<string | null>(null);
  const [cardsError, setCardsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .listCards()
      .then((loaded) => {
        if (cancelled) {
          return;
        }
        setCards(loaded);
        setCardId((current) => current ?? loaded[0]?.id ?? null);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setCardsError(messageOf(e));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [api]);

  const notifications = useNotifications(api, cardId);
  const prefs = usePreferences(api, cardId);

  const toolbar = (
    <>
      <label>
        Tarjeta{' '}
        <select value={cardId ?? ''} onChange={(e) => setCardId(e.target.value)} disabled={cards.length === 0}>
          {cards.map((c) => (
            <option key={c.id} value={c.id}>
              {c.alias} ····{c.panLast4}
            </option>
          ))}
        </select>
      </label>
      <label>
        <input type="checkbox" checked={notifications.onlyUnread} onChange={(e) => notifications.setOnlyUnread(e.target.checked)} />{' '}
        Solo no leídas
      </label>
      {cardsError && <span role="alert" className="feedback feedback--error">{cardsError}</span>}
    </>
  );

  return (
    <NotificationsTemplate
      title="Notificaciones de tarjetas"
      toolbar={toolbar}
      main={
        <NotificationList
          status={notifications.status}
          items={notifications.items}
          error={notifications.error}
          onMarkRead={(id) => void notifications.markRead(id)}
        />
      }
      aside={
        <PreferencesPanel
          preferences={prefs.preferences}
          saving={prefs.saving}
          message={prefs.message}
          error={prefs.error}
          onToggle={prefs.toggle}
          onSave={() => void prefs.save()}
        />
      }
    />
  );
}
