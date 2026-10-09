import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PaymentForm } from '../components/organisms/PaymentForm';
import type { Account } from '../types';

const accounts: Account[] = [
  { id: 'a1', number: 'ACC00000001', holder: 'Ana Ficticia', currency: 'USD', balance: 1000 },
];

async function fillValidForm() {
  await userEvent.type(screen.getByLabelText('Cuenta beneficiaria'), '12345678');
  await userEvent.type(screen.getByLabelText('Monto'), '10.50');
}

describe('PaymentForm', () => {
  it('given valid data when submitting then calls onSubmit with the request', async () => {
    const onSubmit = vi.fn();
    render(<PaymentForm accounts={accounts} submitting={false} onSubmit={onSubmit} />);

    await fillValidForm();
    await userEvent.click(screen.getByRole('button', { name: 'Pagar' }));

    expect(onSubmit).toHaveBeenCalledWith({
      sourceAccountId: 'a1',
      beneficiaryAccount: '12345678',
      amount: '10.50',
      currency: 'USD',
      reference: '',
    });
  });

  it('given invalid data when submitting then shows errors and does not call onSubmit', async () => {
    const onSubmit = vi.fn();
    render(<PaymentForm accounts={accounts} submitting={false} onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Pagar' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Ingrese un monto mayor que 0 (máximo 2 decimales).')).toBeInTheDocument();
  });

  it('given a pending payment when rendering then the submit button is disabled', async () => {
    const onSubmit = vi.fn();
    render(<PaymentForm accounts={accounts} submitting={true} onSubmit={onSubmit} />);

    const button = screen.getByRole('button', { name: /procesando/i });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
