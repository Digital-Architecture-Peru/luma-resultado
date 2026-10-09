import type { TarjetaResumen } from "../../types/tarjeta";
import { TarjetaResumenItem } from "../molecules/TarjetaResumenItem";

interface Props {
  tarjetas: TarjetaResumen[];
  seleccionadaId: string | null;
  onSeleccionar: (id: string) => void;
}

export function ListaTarjetas({ tarjetas, seleccionadaId, onSeleccionar }: Props) {
  if (tarjetas.length === 0) {
    return <p className="estado-vacio">No tienes tarjetas registradas.</p>;
  }
  return (
    <ul className="lista-tarjetas" aria-label="Mis tarjetas">
      {tarjetas.map((t) => (
        <li key={t.id}>
          <TarjetaResumenItem
            tarjeta={t}
            seleccionada={t.id === seleccionadaId}
            onSeleccionar={onSeleccionar}
          />
        </li>
      ))}
    </ul>
  );
}
