import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { PaymentsTable } from './PaymentsTable';
import type { Payment } from '../../types';

const payment: Payment = {
  id: 'id-1',
  reference: 'PAGO-0001',
  beneficiaryName: 'Empresa Eléctrica Demo',
  beneficiaryAccountMasked: '****1234',
  amount: '120.50',
  currency: 'USD',
  status: 'COMPLETED',
  executedAt: '2026-09-01T10:15:00Z',
};

afterEach(() => {
  cleanup();
});

describe('PaymentsTable', () => {
  it('given no payments when rendered then shows empty message', () => {
    render(<PaymentsTable payments={[]} onSelect={() => undefined} />);

    expect(screen.getByText('No hay pagos para los filtros seleccionados.')).toBeTruthy();
  });

  it('given a payment when rendered then shows reference, amount and status label', () => {
    render(<PaymentsTable payments={[payment]} onSelect={() => undefined} />);

    expect(screen.getByText('PAGO-0001')).toBeTruthy();
    expect(screen.getByText('120.50 USD')).toBeTruthy();
    expect(screen.getByText('Completado')).toBeTruthy();
  });

  it('given a payment when detail clicked then calls onSelect with its id', () => {
    const onSelect = vi.fn();
    render(<PaymentsTable payments={[payment]} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ver detalle de PAGO-0001' }));

    expect(onSelect).toHaveBeenCalledWith('id-1');
  });
});
