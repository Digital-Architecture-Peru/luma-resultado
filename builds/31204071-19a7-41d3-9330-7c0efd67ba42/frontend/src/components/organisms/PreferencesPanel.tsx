import type { NotificationType, Preference } from "../../api/types";
import type { RemoteState } from "../../hooks/useCardNotifications";
import { PreferenceRow } from "../molecules/PreferenceRow";

interface PreferencesPanelProps {
  preferences: RemoteState<Preference[]>;
  saving: boolean;
  saveError: string | null;
  onToggle: (type: NotificationType, enabled: boolean) => void;
}

/** Organismo: panel de preferencias de aviso de la tarjeta seleccionada. */
export function PreferencesPanel({ preferences, saving, saveError, onToggle }: PreferencesPanelProps) {
  return (
    <section className="panel" aria-labelledby="preferences-title">
      <h2 id="preferences-title" className="panel__title">
        Preferencias de aviso
      </h2>
      {preferences.status === "loading" && <p role="status">Cargando preferencias…</p>}
      {preferences.status === "error" && <p role="alert">{preferences.message}</p>}
      {preferences.status === "success" &&
        preferences.data.map((preference) => (
          <PreferenceRow
            key={preference.type}
            type={preference.type}
            enabled={preference.enabled}
            disabled={saving}
            onChange={onToggle}
          />
        ))}
      {saveError !== null && <p role="alert">{saveError}</p>}
    </section>
  );
}
