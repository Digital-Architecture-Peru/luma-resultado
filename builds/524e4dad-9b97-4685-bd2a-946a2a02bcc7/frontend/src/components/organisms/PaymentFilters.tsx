import { useState } from 'react';
import type { FormEvent } from 'react';
import type { PaymentStatus } from '../../api/types';
import { STATUS_LABELS } from '../../utils/format';
import { Button } from '../atoms/Button';
import { LabeledInput } from '../molecules/LabeledInput';
import { LabeledSelect } from '../molecules/LabeledSelect';

export interface PaymentFilterValues {
  from: string;
  to: string;
  status: PaymentStatus | '';
}

interface PaymentFiltersProps {
  initial: PaymentFilterValues;
  onSubmit: (values: PaymentFilterValues) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  ...(Object.keys(STATUS_LABELS) as PaymentStatus[]).map((s) => ({ value: s, label: STATUS_LABELS[s] })),
];

export function PaymentFilters({ initial, onSubmit }: PaymentFiltersProps) {
  const [values, setValues] = useState<PaymentFilterValues>(initial);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form className="filters" onSubmit={handleSubmit} aria-label="Filtros de pagos">
      <LabeledInput
        label="Desde"
        type="date"
        value={values.from}
        onChange={(e) => setValues({ ...values, from: e.target.value })}
      />
      <LabeledInput
        label="Hasta"
        type="date"
        value={values.to}
        onChange={(e) => setValues({ ...values, to: e.target.value })}
      />
      <LabeledSelect
        label="Estado"
        options={STATUS_OPTIONS}
        value={values.status}
        onChange={(e) => setValues({ ...values, status: e.target.value as PaymentStatus | '' })}
      />
      <Button type="submit">Consultar</Button>
    </form>
  );
}
