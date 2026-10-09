import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PaymentForm, validate } from './PaymentForm';

const ACCOUNTS = ['ES00-FAKE-0001', 'ES00-FAKE-0002'];

describe('validate', () => {
  const base = { sourceAccount: 'A', beneficiary: 'B', amount: '10.00', currency: 'EUR', reference: '' };

  it('given valid values then no errors', () => {
    expect(validate(base)).toEqual({});
  });

  it('given zero or 3 decimals then amount error', () => {
    expect(validate({ ...base, amount: '0' }).amount).toBeDefined();
    expect(validate({ ...base, amount: '1.234' }).amount).toBeDefined();
  });

  it('given beneficiary equal to source then error', () => {
    expect(validate({ ...base, beneficiary: 'A' }).beneficiary).toBeDefined();
  });
});

describe('PaymentForm', () => {
  it('given empty fields when submitting then shows errors and does not call onSubmit', async () => {
    const onSubmit = vi.fn();
    render(<PaymentForm accounts={ACCOUNTS} submitting={false} onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Pagar' }));

    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('given valid data when submitting then calls onSubmit with values', async () => {
    const onSubmit = vi.fn();
    render(<PaymentForm accounts={ACCOUNTS} submitting={false} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Beneficiario'), 'ES00-FAKE-9001');
    await userEvent.type(screen.getByLabelText('Importe (EUR)'), '25.50');
    await userEvent.click(screen.getByRole('button', { name: 'Pagar' }));

    expect(onSubmit).toHaveBeenCalledWith({
      sourceAccount: 'ES00-FAKE-0001',
      beneficiary: 'ES00-FAKE-9001',
      amount: '25.50',
      currency: 'EUR',
      reference: '',
    });
  });

  it('given submitting true then button is disabled', () => {
    render(<PaymentForm accounts={ACCOUNTS} submitting onSubmit={vi.fn()} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
