import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PaymentForm } from './PaymentForm';

async function fillValidForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Cuenta de origen'), '00012345678901');
  await user.type(screen.getByLabelText('Beneficiario'), 'Empresa Demo');
  await user.type(screen.getByLabelText('Importe'), '99.90');
  await user.type(screen.getByLabelText('Concepto'), 'Recibo');
  return user;
}

describe('PaymentForm', () => {
  it('given empty form when submitting then shows errors and does not call onSubmit', async () => {
    const onSubmit = vi.fn();
    render(<PaymentForm loading={false} onSubmit={onSubmit} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Pagar' }));
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('given valid data when submitting then calls onSubmit with the request', async () => {
    const onSubmit = vi.fn();
    render(<PaymentForm loading={false} onSubmit={onSubmit} />);
    const user = await fillValidForm();
    await user.click(screen.getByRole('button', { name: 'Pagar' }));
    expect(onSubmit).toHaveBeenCalledWith({
      originAccount: '00012345678901',
      beneficiary: 'Empresa Demo',
      amount: 99.9,
      currency: 'PEN',
      concept: 'Recibo',
    });
  });

  it('given loading when rendering then submit button is disabled', () => {
    render(<PaymentForm loading onSubmit={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Procesando...' })).toBeDisabled();
  });
});
