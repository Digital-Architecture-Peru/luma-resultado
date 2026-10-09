import type { NotificationType } from "../../api/types";
import { TYPE_META } from "../../domain/notificationMeta";
import { Toggle } from "../atoms/Toggle";

interface PreferenceRowProps {
  type: NotificationType;
  enabled: boolean;
  disabled?: boolean;
  onChange: (type: NotificationType, enabled: boolean) => void;
}

/** Molécula: una preferencia (interruptor + descripción del tipo de aviso). */
export function PreferenceRow({ type, enabled, disabled = false, onChange }: PreferenceRowProps) {
  const meta = TYPE_META[type];
  return (
    <div className="preference-row">
      <Toggle
        id={`pref-${type}`}
        label={meta.label}
        checked={enabled}
        disabled={disabled}
        onChange={(checked) => onChange(type, checked)}
      />
      <p className="preference-row__description">{meta.description}</p>
    </div>
  );
}
