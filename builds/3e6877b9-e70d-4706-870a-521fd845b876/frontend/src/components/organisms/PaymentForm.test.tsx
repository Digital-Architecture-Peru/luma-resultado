import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Account, Card } from '../../types';
import { PaymentForm } from './PaymentForm';

const card: Card = { id: 'card-1', last4: '4242', brand: 'VISA', creditLimit: '5000.00', balance: '1250.50' };
const accounts: Account[] = [
  { id: 'acc-1', alias: 'Ahorros', balance: '2500.00' },
  { id: 'acc-2', alias: 'Corriente', balance: '10.00' },
];

function typeAmount(value: string) {
  fireEvent.change(screen.getByLabelText('Monto a pagar'), { target: { value } });
}

describe('PaymentForm', () => {
  it('given a valid amount when submitting then calls onSubmit and announces success', async () => {
    const onSubmit = vi.fn(async (_accountId: string, _amount: string) => {});
    render(<PaymentForm card={card} accounts={accounts} onSubmit={onSubmit} />);

    typeAmount('150.00');
    fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('acc-1', '150.00'));
    const status = await screen.findByRole('status');
    expect(status.textContent).toContain('registrado correctamente');
  });

  it('given an invalid amount when submitting then shows error and does not call onSubmit', async () => {
    const onSubmit = vi.fn(async (_accountId: string, _amount: string) => {});
    render(<PaymentForm card={card} accounts={accounts} onSubmit={onSubmit} />);

    typeAmount('abc');
    fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('hasta 2 decimales');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('given the backend rejects the payment then shows its message', async () => {
    const onSubmit = vi.fn(async (_accountId: string, _amount: string) => {
      throw new Error('Saldo insuficiente en la cuenta de origen');
    });
    render(<PaymentForm card={card} accounts={accounts} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Cuenta de origen'), { target: { value: 'acc-2' } });
    typeAmount('150.00');
    fireEvent.click(screen.getByRole('button', { name: 'Pagar' }));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toBe('Saldo insuficiente en la cuenta de origen');
    expect(onSubmit).toHaveBeenCalledWith('acc-2', '150.00');
  });
});
