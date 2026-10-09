import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { PaymentsApi } from '../api/paymentsClient';
import type { PagedPayments } from '../api/types';
import { PaymentsPage } from './PaymentsPage';

const data: PagedPayments = {
  items: [
    {
      id: 'a',
      beneficiary: 'Agua Cristalina',
      accountMasked: '****1111',
      amount: '350.50',
      currency: 'USD',
      status: 'PENDING',
      paidAt: '2026-09-04T10:00:00+00:00',
      reference: 'REF-2026001',
    },
  ],
  page: 1,
  pageSize: 10,
  total: 1,
};

describe('PaymentsPage', () => {
  it('given api success when loaded then shows payments', async () => {
    const api: PaymentsApi = { list: vi.fn(async () => data) };

    render(<PaymentsPage api={api} />);

    expect(await screen.findByText('Agua Cristalina')).toBeInTheDocument();
    // "Pendiente" también es una opción del filtro: se acota la búsqueda a la tabla.
    const table = screen.getByRole('table');
    expect(within(table).getByText('Pendiente')).toBeInTheDocument();
  });

  it('given api failure when loaded then shows alert', async () => {
    const api: PaymentsApi = {
      list: vi.fn(async () => {
        throw new Error('Fallo de red');
      }),
    };

    render(<PaymentsPage api={api} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Fallo de red');
  });

  it('given status filter when submitted then api called with status and page 1', async () => {
    const list = vi.fn(async () => data);
    render(<PaymentsPage api={{ list }} />);
    await screen.findByText('Agua Cristalina');

    await userEvent.selectOptions(screen.getByLabelText('Estado'), 'REJECTED');
    await userEvent.click(screen.getByRole('button', { name: 'Consultar' }));

    await vi.waitFor(() => {
      expect(list).toHaveBeenLastCalledWith(expect.objectContaining({ status: 'REJECTED', page: 1 }));
    });
  });
});
