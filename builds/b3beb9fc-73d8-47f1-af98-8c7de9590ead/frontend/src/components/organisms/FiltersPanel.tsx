import type { FormEvent } from 'react';
import { ESTADOS } from '../../types/pagos';
import type { FiltrosPagos } from '../../types/pagos';
import { DateRangeFilter } from '../molecules/DateRangeFilter';

interface FiltersPanelProps {
  filtros: FiltrosPagos;
  disabled: boolean;
  onChange: (filtros: FiltrosPagos) => void;
  onSubmit: () => void;
}

export function FiltersPanel({ filtros, disabled, onChange, onSubmit }: FiltersPanelProps) {
  function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    onSubmit();
  }

  return (
    <form className="filters" onSubmit={manejarEnvio} aria-label="Filtros de pagos">
      <DateRangeFilter
        desde={filtros.desde}
        hasta={filtros.hasta}
        onChange={(campo, valor) => onChange({ ...filtros, [campo]: valor })}
      />
      <div className="field">
        <label htmlFor="filtro-estado">Estado</label>
        <select
          id="filtro-estado"
          value={filtros.estado}
          onChange={(e) => onChange({ ...filtros, estado: e.target.value as FiltrosPagos['estado'] })}
        >
          <option value="">Todos</option>
          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>
              {estado.charAt(0) + estado.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="primary" disabled={disabled}>
        Consultar
      </button>
    </form>
  );
}
