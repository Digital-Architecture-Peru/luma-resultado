import type { ChangeEvent } from 'react';
import type { FiltroEstado } from '../../model';

interface FiltroEstadoSelectProps {
  valor: FiltroEstado;
  onChange: (valor: FiltroEstado) => void;
}

export function FiltroEstadoSelect({ valor, onChange }: FiltroEstadoSelectProps) {
  const manejar = (e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value as FiltroEstado);
  return (
    <div className="field">
      <label htmlFor="filtro-estado">Estado</label>
      <select id="filtro-estado" value={valor} onChange={manejar}>
        <option value="TODAS">Todas</option>
        <option value="ACTIVA">Activa</option>
        <option value="BLOQUEADA">Bloqueada</option>
        <option value="VENCIDA">Vencida</option>
      </select>
    </div>
  );
}
