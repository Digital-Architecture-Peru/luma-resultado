import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Transaction } from '../domain/types';
import { CardTransactionPage } from '../pages/CardTransactionPage';
import { ApiError } from '../services/cardTransactionsApi';
import type { CardTransactionsApi } from '../services/cardTransactionsApi';

const approved: Transaction = {
  id: 't1',
  cardId: 'c1',
  amount: 100.5,
  currency: 'USD',
  status: 'APPROVED',
  createdAt: '2026-01-01T10:00:00Z',
  rejectionReason: null,
};

function fakeApi(overrides: Partial<CardTransactionsApi> = {}): CardTransactionsApi {
  return {
    listCards: vi.fn().mockResolvedValue([{ id: 'c1', maskedPan: '**** 4242', holderAlias: 'Demo' }]),
    listTransactions: vi.fn().mockResolvedValue([]),
    createPayment: vi.fn().mockResolvedValue(approved),
    ...overrides,
  };
}

async function submitAmount(amount: string) {
  await screen.findByRole('option', { name: /Demo/ });
  await userEvent.type(screen.getByLabelText(/importe/i), amount);
  await userEvent.click(screen.getByRole('button', { name: 'Pagar' }));
}

describe('CardTransactionPage', () => {
  it('given no movements when loaded then shows the empty state', async () => {
    render(<CardTransactionPage api={fakeApi()} newKey={() => 'key-1'} />);

    expect(await screen.findByText(/Aún no hay movimientos/)).toBeInTheDocument();
  });

  it('given an approved payment when submitted then announces success with the idempotency key', async () => {
    const api = fakeApi();
    render(<CardTransactionPage api={api} newKey={() => 'key-1'} />);

    await submitAmount('100.50');

    expect(await screen.findByRole('status')).toHaveTextContent('Pago aprobado.');
    expect(api.createPayment).toHaveBeenCalledWith({ cardId: 'c1', amount: 100.5, currency: 'USD' }, 'key-1');
  });

  it('given a rejected payment when submitted then shows the rejection reason', async () => {
    const rejected: Transaction = { ...approved, status: 'REJECTED', rejectionReason: 'Sin fondos' };
    const api = fakeApi({ createPayment: vi.fn().mockResolvedValue(rejected) });
    render(<CardTransactionPage api={api} newKey={() => 'key-1'} />);

    await submitAmount('10');

    expect(await screen.findByRole('alert')).toHaveTextContent('Pago rechazado: Sin fondos');
  });

  it('given a network failure when submitting then shows the error and reuses the same key on retry', async () => {
    const createPayment = vi
      .fn()
      .mockRejectedValueOnce(new ApiError('Sin conexión', 0))
      .mockResolvedValueOnce(approved);
    const newKey = vi.fn().mockReturnValueOnce('key-1').mockReturnValueOnce('key-2');
    render(<CardTransactionPage api={fakeApi({ createPayment })} newKey={newKey} />);

    await submitAmount('20');
    expect(await screen.findByRole('alert')).toHaveTextContent('Sin conexión');

    await userEvent.click(screen.getByRole('button', { name: 'Pagar' }));
    await waitFor(() => expect(createPayment).toHaveBeenCalledTimes(2));

    expect(createPayment.mock.calls[0][1]).toBe('key-1');
    expect(createPayment.mock.calls[1][1]).toBe('key-1');
  });
});
