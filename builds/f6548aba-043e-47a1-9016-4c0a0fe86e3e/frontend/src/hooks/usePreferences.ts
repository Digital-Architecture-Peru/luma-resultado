import { useCallback, useEffect, useState } from 'react';
import type { CardNotificationsApi } from '../api/cardNotificationsClient';
import type { Channel, NotificationType, Preference } from '../api/types';
import { isLocked, setPreference } from '../model/notifications';
import { toMessage } from './useNotifications';

export function usePreferences(api: CardNotificationsApi) {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .getPreferences()
      .then((loaded) => {
        if (active) setPreferences(loaded);
      })
      .catch((e: unknown) => {
        if (active) setError(toMessage(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api]);

  const toggle = useCallback((eventType: NotificationType, channel: Channel, enabled: boolean) => {
    if (isLocked(eventType, channel)) return;
    setSaved(false);
    setPreferences((current) => setPreference(current, eventType, channel, enabled));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      setPreferences(await api.savePreferences(preferences));
      setSaved(true);
    } catch (e) {
      setError(toMessage(e));
    } finally {
      setSaving(false);
    }
  }, [api, preferences]);

  return { preferences, loading, saving, saved, error, toggle, save };
}
