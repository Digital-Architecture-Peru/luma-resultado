import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Pago } from '../../types/pagos';
import { FiltersPanel } from './FiltersPanel';
import { PaymentsTable } from './PaymentsTable';

const pagos: Pago[] = [
  {
    id: 1,
    cuenta: '****1234',
    beneficiario: 'Telecom Demo',
    concepto: 'Plan de internet',
    monto: 39.99,
    moneda: 'USD',
    estado: 'PROCESADO',
    fechaPago: '2026-09-05T16:30:00Z',
  },
  {
    id: 2,
    cuenta: '****1234',
    beneficiario: 'Seguros Demo',
    concepto: 'Prima mensual',
    monto: 64.75,
    moneda: 'USD',
    estado: 'RECHAZADO',
    fechaPago: '2026-10-04T11:45:00Z',
  },
];

describe('organisms', () => {
  it('given pagos when render PaymentsTable then muestra una fila por pago', () => {
    render(<PaymentsTable pagos={pagos} />);

    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('Telecom Demo')).toBeInTheDocument();
    expect(screen.getByText('Seguros Demo')).toBeInTheDocument();
  });

  it('given lista vacía when render PaymentsTable then muestra el estado vacío', () => {
    render(<PaymentsTable pagos={[]} />);

    expect(screen.getByText(/No se encontraron pagos/)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('given FiltersPanel when se envía el formulario then llama onSubmit', async () => {
    const onSubmit = vi.fn();
    render(
      <FiltersPanel
        filtros={{ desde: '', hasta: '', estado: '' }}
        disabled={false}
        onChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Consultar' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('given cambio de estado when selecciona then onChange recibe el estado', async () => {
    const onChange = vi.fn();
    render(
      <FiltersPanel
        filtros={{ desde: '', hasta: '', estado: '' }}
        disabled={false}
        onChange={onChange}
        onSubmit={vi.fn()}
      />,
    );

    await userEvent.selectOptions(screen.getByLabelText('Estado'), 'PENDIENTE');

    expect(onChange).toHaveBeenCalledWith({ desde: '', hasta: '', estado: 'PENDIENTE' });
  });
});
