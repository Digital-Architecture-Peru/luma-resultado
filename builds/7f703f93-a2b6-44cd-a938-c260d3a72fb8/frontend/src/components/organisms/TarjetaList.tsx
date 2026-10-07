import type { Tarjeta } from '../../model';
import { TarjetaCard } from '../molecules/TarjetaCard';

interface TarjetaListProps {
  tarjetas: Tarjeta[];
}

export function TarjetaList({ tarjetas }: TarjetaListProps) {
  if (tarjetas.length === 0) {
    return <p className="empty">No hay tarjetas para el filtro seleccionado.</p>;
  }
  return (
    <section className="grid" aria-label="Listado de tarjetas">
      {tarjetas.map((t) => (
        <TarjetaCard key={t.id} tarjeta={t} />
      ))}
    </section>
  );
}
