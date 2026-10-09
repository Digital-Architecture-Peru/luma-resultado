import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Pago } from '../../types/pagos';
import { DateRangeFilter } from './DateRangeFilter';
import { Pager } from './Pager';
import { PaymentRow } from './PaymentRow';

const pago: Pago = {
  id: 1,
  cuenta: '****1234',
  beneficiario: 'Agua Potable Demo',
  concepto: 'Servicio de agua',
  monto: 22.1,
  moneda: 'USD',
  estado: 'PROCESADO',
  fechaPago: '2026-09-03T09:00:00Z',
};

describe('molecules', () => {
  it('given un pago when render PaymentRow then muestra beneficiario, cuenta enmascarada y estado', () => {
    render(
      <table>
        <tbody>
          <PaymentRow pago={pago} />
        </tbody>
      </table>,
    );

    expect(screen.getByText('Agua Potable Demo')).toBeInTheDocument();
    expect(screen.getByText('****1234')).toBeInTheDocument();
    expect(screen.getByText('Procesado')).toBeInTheDocument();
  });

  it('given DateRangeFilter when el usuario escribe then notifica campo y valor', async () => {
    const onChange = vi.fn();
    render(<DateRangeFilter desde="" hasta="" onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('Desde'), '2026-09-01');

    expect(onChange).toHaveBeenCalledWith('desde', '2026-09-01');
  });

  it('given primera página when render Pager then Anterior está deshabilitado y Siguiente navega', async () => {
    const onPageChange = vi.fn();
    render(<Pager page={0} size={10} total={25} onPageChange={onPageChange} />);

    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    expect(screen.getByText('Página 1 de 3')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('given última página when render Pager then Siguiente está deshabilitado', () => {
    render(<Pager page={2} size={10} total={25} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled();
  });
});
