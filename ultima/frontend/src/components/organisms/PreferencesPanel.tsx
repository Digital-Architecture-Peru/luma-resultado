import { CHANNELS, CHANNEL_LABELS, NOTIFICATION_TYPES, TYPE_LABELS } from '../../types/notification';
import type { Channel, NotificationType, Preference } from '../../types/notification';
import Button from '../atoms/Button';
import PreferenceToggle from '../molecules/PreferenceToggle';

interface PreferencesPanelProps {
  preferences: Preference[];
  saving: boolean;
  message: string | null;
  error: string | null;
  onToggle: (type: NotificationType, channel: Channel) => void;
  onSave: () => void;
}

export default function PreferencesPanel({ preferences, saving, message, error, onToggle, onSave }: PreferencesPanelProps) {
  const isEnabled = (type: NotificationType, channel: Channel) =>
    preferences.some((p) => p.type === type && p.channel === channel && p.enabled);

  return (
    <section aria-labelledby="preferences-heading">
      <h2 id="preferences-heading">Preferencias</h2>
      {NOTIFICATION_TYPES.map((type) => (
        <fieldset key={type} className="prefs-group">
          <legend>{TYPE_LABELS[type]}</legend>
          {CHANNELS.map((channel) => (
            <PreferenceToggle
              key={channel}
              label={`${TYPE_LABELS[type]} por ${CHANNEL_LABELS[channel]}`}
              checked={isEnabled(type, channel)}
              onChange={() => onToggle(type, channel)}
            />
          ))}
        </fieldset>
      ))}
      <Button onClick={onSave} disabled={saving || preferences.length === 0}>
        {saving ? 'Guardando…' : 'Guardar preferencias'}
      </Button>
      {message && <p role="status" className="feedback feedback--ok">{message}</p>}
      {error && <p role="alert" className="feedback feedback--error">{error}</p>}
    </section>
  );
}
