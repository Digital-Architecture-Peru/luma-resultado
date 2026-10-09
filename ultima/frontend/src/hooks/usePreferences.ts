import { useCallback, useEffect, useState } from 'react';
import { messageOf, type NotificationsApi } from '../services/notificationsApi';
import type { Channel, NotificationType, Preference } from '../types/notification';

export function usePreferences(api: NotificationsApi, cardId: string | null) {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cardId) {
      return;
    }
    let cancelled = false;
    setMessage(null);
    setError(null);
    api
      .getPreferences(cardId)
      .then((loaded) => {
        if (!cancelled) {
          setPreferences(loaded);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(messageOf(e));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [api, cardId]);

  const toggle = useCallback((type: NotificationType, channel: Channel) => {
    setMessage(null);
    setPreferences((current) =>
      current.map((p) => (p.type === type && p.channel === channel ? { ...p, enabled: !p.enabled } : p)),
    );
  }, []);

  const save = useCallback(async () => {
    if (!cardId) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      setPreferences(await api.updatePreferences(cardId, preferences));
      setMessage('Preferencias guardadas');
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setSaving(false);
    }
  }, [api, cardId, preferences]);

  return { preferences, saving, message, error, toggle, save };
}
