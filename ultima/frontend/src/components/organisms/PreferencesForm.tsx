import { useEffect, useState, type FormEvent } from "react";
import type { Preference, RemoteState } from "../../types/notifications";
import { Button } from "../atoms/Button";
import { PreferenceRow } from "../molecules/PreferenceRow";

interface PreferencesFormProps {
  preferences: Preference[];
  state: RemoteState;
  saved: boolean;
  onSave: (preferences: Preference[]) => void;
}

export function PreferencesForm({ preferences, state, saved, onSave }: PreferencesFormProps) {
  const [draft, setDraft] = useState<Preference[]>(preferences);

  useEffect(() => {
    setDraft(preferences);
  }, [preferences]);

  if (state === "loading" || state === "idle") {
    return <p role="status">Cargando preferencias…</p>;
  }
  if (state === "error") {
    return <p role="alert">No se pudieron cargar las preferencias.</p>;
  }

  const update = (index: number, next: Preference) =>
    setDraft((current) => current.map((p, i) => (i === index ? next : p)));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSave(draft);
  };

  return (
    <form onSubmit={submit} aria-label="Preferencias de notificación">
      {draft.map((p, index) => (
        <PreferenceRow key={`${p.type}-${p.channel}`} preference={p} onChange={(next) => update(index, next)} />
      ))}
      <Button type="submit">Guardar preferencias</Button>
      {saved && <p role="status">Preferencias guardadas.</p>}
    </form>
  );
}
