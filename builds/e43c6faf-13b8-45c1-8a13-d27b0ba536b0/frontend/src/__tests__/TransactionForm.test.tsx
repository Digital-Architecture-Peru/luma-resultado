import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TransactionForm } from '../components/organisms/TransactionForm';

afterEach(() => {
  cleanup();
});

function fillAndSubmit(amount: string) {
  fireEvent.change(screen.getByLabelText('Monto'), { target: { value: amount } });
  fireEvent.change(screen.getByLabelText('Descripción'), { target: { value: '  Café  ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Registrar transacción' }));
}

describe('TransactionForm', () => {
  it('given a non positive amount when submitting then shows an alert and does not call onSubmit', () => {
    const onSubmit = vi.fn(async () => true);
    render(<TransactionForm onSubmit={onSubmit} />);

    fillAndSubmit('0');

    expect(screen.getByRole('alert').textContent).toContain('monto mayor a cero');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('given valid data when submitting then calls onSubmit with a normalized payload and confirms', async () => {
    const onSubmit = vi.fn(async () => true);
    render(<TransactionForm onSubmit={onSubmit} />);

    fillAndSubmit('25.5');

    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toBe('Transacción registrada');
    });
    expect(onSubmit).toHaveBeenCalledWith({
      type: 'PURCHASE',
      amount: 25.5,
      currency: 'USD',
      description: 'Café',
    });
  });

  it('given the server rejects when submitting then no confirmation is shown', async () => {
    const onSubmit = vi.fn(async () => false);
    render(<TransactionForm onSubmit={onSubmit} />);

    fillAndSubmit('10');

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByRole('status')).toBeNull();
  });
});
