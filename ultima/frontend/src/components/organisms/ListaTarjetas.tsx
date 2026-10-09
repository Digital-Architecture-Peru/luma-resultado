import type { EstadoCarga } from '../../hooks/useTarjetas';
import type { Tarjeta } from '../../types/tarjeta';
import { Boton } from '../atoms/Boton';
import { TarjetaCard } from '../molecules/TarjetaCard';

interface ListaTarjetasProps {
  estado: EstadoCarga;
  tarjetas: Tarjeta[];
  error: string | null;
  onReintentar: () => void;
}

export function ListaTarjetas({ estado, tarjetas, error, onReintentar }: ListaTarjetasProps) {
  if (estado === 'loading') {
    return <p role="status">Cargando tarjetas…</p>;
  }
  if (estado === 'error') {
    return (
      <div role="alert" className="mensaje mensaje--error">
        <p>{error ?? 'No se pudo cargar la información.'}</p>
        <Boton texto="Reintentar" onClick={onReintentar} />
      </div>
    );
  }
  if (tarjetas.length === 0) {
    return <p role="status">No tienes tarjetas registradas.</p>;
  }
  return (
    <ul className="lista-tarjetas">
      {tarjetas.map((t) => (
        <li key={t.id}>
          <TarjetaCard tarjeta={t} />
        </li>
      ))}
    </ul>
  );
}
