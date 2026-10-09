import type { Channel, NotificationType, Preference } from '../../api/types';
import { EVENT_ORDER } from '../../model/notifications';
import { Button } from '../atoms/Button';
import { PreferenceRow } from '../molecules/PreferenceRow';

interface PreferencesPanelProps {
  preferences: Preference[];
  saving: boolean;
  saved: boolean;
  error: string | null;
  onToggle: (eventType: NotificationType, channel: Channel, enabled: boolean) => void;
  onSave: () => void;
}

export function PreferencesPanel({ preferences, saving, saved, error, onToggle, onSave }: PreferencesPanelProps) {
  return (
    <section aria-labelledby="preferences-heading" className="card">
      <h2 id="preferences-heading">Preferencias de aviso</h2>
      <p className="muted">
        Los avisos de seguridad (bloqueo, desbloqueo y compra rechazada) siempre se muestran en la banca.
        Correo, SMS y push son preferencias; el envío real aún no está integrado.
      </p>
      {EVENT_ORDER.map((eventType) => (
        <PreferenceRow key={eventType} eventType={eventType} preferences={preferences} onToggle={onToggle} />
      ))}
      <div className="card__footer">
        <Button disabled={saving} onClick={onSave}>
          {saving ? 'Guardando…' : 'Guardar preferencias'}
        </Button>
        <p role="status" aria-live="polite">
          {saved ? 'Preferencias guardadas.' : ''}
        </p>
        {error ? <p role="alert" className="error">{error}</p> : null}
      </div>
    </section>
  );
}
