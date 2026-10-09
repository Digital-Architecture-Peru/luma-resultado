import { Button } from '../atoms/Button';
import { DateField } from '../atoms/DateField';
import type { PaymentFilters, PaymentStatus } from '../../types';
import { useState } from 'react';
import type { FormEvent } from 'react';

interface FilterBarProps {
  onSearch: (filters: PaymentFilters) => void;
  disabled?: boolean;
}

export function FilterBar({ onSearch, disabled = false }: FilterBarProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState<PaymentStatus | ''>('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch({ from, to, status, page: 0 });
  }

  return (
    <form className="filter-bar" onSubmit={submit} aria-label="Filtros de pagos">
      <DateField id="filter-from" label="Desde" value={from} onChange={(e) => setFrom(e.target.value)} />
      <DateField id="filter-to" label="Hasta" value={to} onChange={(e) => setTo(e.target.value)} />
      <label className="field" htmlFor="filter-status">
        <span>Estado</span>
        <select
          id="filter-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as PaymentStatus | '')}
        >
          <option value="">Todos</option>
          <option value="PENDING">Pendiente</option>
          <option value="COMPLETED">Completado</option>
          <option value="REJECTED">Rechazado</option>
        </select>
      </label>
      <Button type="submit" disabled={disabled}>
        Buscar
      </Button>
    </form>
  );
}
