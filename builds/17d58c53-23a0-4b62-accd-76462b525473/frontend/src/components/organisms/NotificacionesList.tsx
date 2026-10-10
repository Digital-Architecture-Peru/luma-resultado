import type { EstadoRemoto, Notificacion } from '../../types/notificacion';
import { NotificacionItem } from '../molecules/NotificacionItem';

interface Props {
  estado: EstadoRemoto;
  items: Notificacion[];
  error: string | null;
  onMarcarLeida: (id: string) => void;
}

export function NotificacionesList({ estado, items, error, onMarcarLeida }: Props) {
  if (estado === 'idle' || estado === 'loading') {
    return <p role="status">Cargando notificaciones…</p>;
  }
  if (estado === 'error') {
    return <p role="alert">No se pudieron cargar las notificaciones: {error}</p>;
  }
  if (items.length === 0) {
    return <p role="status">No tienes notificaciones.</p>;
  }
  return (
    <ul className="lista" aria-label="Notificaciones">
      {items.map((n) => (
        <NotificacionItem key={n.id} notificacion={n} onMarcarLeida={onMarcarLeida} />
      ))}
    </ul>
  );
}
