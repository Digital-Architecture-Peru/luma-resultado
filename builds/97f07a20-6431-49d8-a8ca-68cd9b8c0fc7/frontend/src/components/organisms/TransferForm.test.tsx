import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Account } from '../../domain/types';
import { TransferForm } from './TransferForm';

const accounts: Account[] = [
  { id: 1, number: '0001', holderAlias: 'Ahorros', currency: 'USD', balance: '100.00' },
  { id: 2, number: '0002', holderAlias: 'Corriente', currency: 'USD', balance: '10.50' },
];

function setup(overrides: { submitting?: boolean; serverError?: string } = {}) {
  const onSubmit = vi.fn();
  render(<TransferForm accounts={accounts} submitting={false} onSubmit={onSubmit} {...overrides} />);
  return { onSubmit, user: userEvent.setup() };
}

describe('TransferForm', () => {
  it('given an empty form, when submitting, then shows errors and does not call onSubmit', async () => {
    const { onSubmit, user } = setup();

    await user.click(screen.getByRole('button', { name: 'Transferir' }));

    expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(3);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('given valid data, when submitting, then calls onSubmit with the typed request', async () => {
    const { onSubmit, user } = setup();

    await user.selectOptions(screen.getByLabelText('Cuenta de origen'), '1');
    await user.selectOptions(screen.getByLabelText('Cuenta de destino'), '2');
    await user.type(screen.getByLabelText('Monto'), '25.50');
    await user.type(screen.getByLabelText('Descripción (opcional)'), ' Ahorro ');
    await user.click(screen.getByRole('button', { name: 'Transferir' }));

    expect(onSubmit).toHaveBeenCalledWith({
      sourceAccountId: 1,
      targetAccountId: 2,
      amount: '25.50',
      currency: 'USD',
      description: 'Ahorro',
    });
  });

  it('given amount above balance, when submitting, then shows the balance error', async () => {
    const { onSubmit, user } = setup();

    await user.selectOptions(screen.getByLabelText('Cuenta de origen'), '2');
    await user.selectOptions(screen.getByLabelText('Cuenta de destino'), '1');
    await user.type(screen.getByLabelText('Monto'), '50');
    await user.click(screen.getByRole('button', { name: 'Transferir' }));

    expect(screen.getByText('El monto supera el saldo disponible.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('given letters typed in amount, when typing, then only numeric characters remain', async () => {
    const { user } = setup();

    await user.type(screen.getByLabelText('Monto'), 'a1b2.5c');

    expect(screen.getByLabelText('Monto')).toHaveValue('12.5');
  });

  it('given submitting state, when rendered, then disables the button', () => {
    setup({ submitting: true });

    expect(screen.getByRole('button', { name: 'Transfiriendo…' })).toBeDisabled();
  });

  it('given a server error, when rendered, then shows it as an alert', () => {
    setup({ serverError: 'El saldo de la cuenta origen es insuficiente.' });

    expect(screen.getByRole('alert')).toHaveTextContent('insuficiente');
  });
});
