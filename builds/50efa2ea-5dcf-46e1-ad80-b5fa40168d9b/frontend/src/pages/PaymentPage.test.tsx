import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { PaymentsApi } from '../services/paymentsApi';
import type { Payment } from '../types';
import { PaymentPage } from './PaymentPage';

const completed: Payment = {
  id: 'id-1',
  status: 'COMPLETED',
  sourceAccount: 'ES00-FAKE-0001',
  beneficiary: 'ES00-FAKE-9001',
  amount: '25.50',
  currency: 'EUR',
  reference: '',
  createdAt: '2026-01-01T00:00:00Z',
};

async function fillAndSubmit() {
  await userEvent.type(screen.getByLabelText('Beneficiario'), 'ES00-FAKE-9001');
  await userEvent.type(screen.getByLabelText('Importe (EUR)'), '25.50');
  await userEvent.click(screen.getByRole('button', { name: 'Pagar' }));
}

describe('PaymentPage', () => {
  it('given api success then shows receipt', async () => {
    const api: PaymentsApi = { create: vi.fn().mockResolvedValue(completed) };
    render(<PaymentPage api={api} />);

    await fillAndSubmit();

    expect(await screen.findByRole('status')).toHaveTextContent('Completado');
    expect(api.create).toHaveBeenCalledTimes(1);
  });

  it('given api failure then shows error message', async () => {
    const api: PaymentsApi = { create: vi.fn().mockRejectedValue(new Error('Servicio no disponible')) };
    render(<PaymentPage api={api} />);

    await fillAndSubmit();

    expect(await screen.findByText('Servicio no disponible')).toBeInTheDocument();
  });
});
