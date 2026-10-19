import { useState, type FormEvent } from 'react';
import type { EstadoPago } from '../../api/pagosClient';
import { ETIQUETA_ESTADO, finDelDia, inicioDelDia } from './formato';

export interface ValoresFiltro {
  desde?: string;
  hasta?: string;
  estado?: EstadoPago;
}

interface Props {
  onAplicar: (valores: ValoresFiltro) => void;
}

export function Filtros({ onAplicar }: Props) {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [estado, setEstado] = useState<EstadoPago | ''>('');

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    onAplicar({
      desde: inicioDelDia(desde),
      hasta: finDelDia(hasta),
      estado: estado || undefined
    });
  }

  return (
    <form className="filtros" onSubmit={enviar} aria-label="Filtros de pagos">
      <label>
        Desde
        <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
      </label>
      <label>
        Hasta
        <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
      </label>
      <label>
        Estado
        <select value={estado} onChange={(e) => setEstado(e.target.value as EstadoPago | '')}>
          <option value="">Todos</option>
          {(Object.keys(ETIQUETA_ESTADO) as EstadoPago[]).map((e) => (
            <option key={e} value={e}>
              {ETIQUETA_ESTADO[e]}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Buscar</button>
    </form>
  );
}
