import type { EstadoRemoto, Preferencia } from '../../types/notificacion';
import { PreferenciaRow } from '../molecules/PreferenciaRow';

interface Props {
  estado: EstadoRemoto;
  preferencias: Preferencia[];
  error: string | null;
  onGuardar: (preferencia: Preferencia) => void;
}

export function PreferenciasPanel({ estado, preferencias, error, onGuardar }: Props) {
  return (
    <section aria-labelledby="titulo-preferencias" className="panel">
      <h2 id="titulo-preferencias">Preferencias de notificación</h2>
      {error && <p role="alert">{error}</p>}
      {estado === 'loading' && <p role="status">Cargando preferencias…</p>}
      {estado === 'success' && preferencias.length === 0 && <p role="status">Sin preferencias configuradas.</p>}
      {preferencias.length > 0 && (
        <ul className="lista">
          {preferencias.map((p) => (
            <PreferenciaRow key={`${p.tipo}-${p.canal}-${p.activo}`} preferencia={p} onGuardar={onGuardar} />
          ))}
        </ul>
      )}
    </section>
  );
}
