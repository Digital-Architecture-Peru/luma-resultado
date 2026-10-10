import { TYPE_LABELS, type Preference } from "../../types/notifications";
import { Toggle } from "../atoms/Toggle";

interface PreferenceRowProps {
  preference: Preference;
  onChange: (next: Preference) => void;
}

export function PreferenceRow({ preference, onChange }: PreferenceRowProps) {
  const label = TYPE_LABELS[preference.type];
  const inputId = `threshold-${preference.type}-${preference.channel}`;
  return (
    <div className="preference-row">
      <Toggle
        label={label}
        checked={preference.enabled}
        onChange={(enabled) => onChange({ ...preference, enabled })}
      />
      {preference.type === "LOW_BALANCE" && (
        <div className="field">
          <label htmlFor={inputId}>Umbral de saldo bajo</label>
          <input
            id={inputId}
            type="number"
            min={0}
            step="0.01"
            value={preference.thresholdAmount ?? ""}
            onChange={(event) =>
              onChange({
                ...preference,
                thresholdAmount: event.target.value === "" ? null : Number(event.target.value),
              })
            }
          />
        </div>
      )}
    </div>
  );
}
