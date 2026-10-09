import type { Channel, NotificationType, Preference } from '../../api/types';
import {
  CHANNEL_LABELS,
  CHANNEL_ORDER,
  EVENT_LABELS,
  isLocked,
} from '../../model/notifications';
import { Toggle } from '../atoms/Toggle';

interface PreferenceRowProps {
  eventType: NotificationType;
  preferences: Preference[];
  onToggle: (eventType: NotificationType, channel: Channel, enabled: boolean) => void;
}

export function PreferenceRow({ eventType, preferences, onToggle }: PreferenceRowProps) {
  const eventLabel = EVENT_LABELS[eventType];
  return (
    <fieldset className="preference-row">
      <legend>{eventLabel}</legend>
      {CHANNEL_ORDER.map((channel) => {
        const current = preferences.find((p) => p.eventType === eventType && p.channel === channel);
        return (
          <Toggle
            key={channel}
            label={`${eventLabel} por ${CHANNEL_LABELS[channel]}`}
            visibleText={CHANNEL_LABELS[channel]}
            checked={current?.enabled ?? false}
            disabled={isLocked(eventType, channel)}
            onChange={(enabled) => onToggle(eventType, channel, enabled)}
          />
        );
      })}
    </fieldset>
  );
}
