import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PaymentForm } from '../components/organisms/PaymentForm';
import { parseAmount } from '../domain/types';

const cards = [{ id: 'c1', maskedPan: '**** 4242', holderAlias: 'Demo' }];

function setup(overrides: { busy?: boolean } = {}) {
  const onSubmit = vi.fn();
  render(
    <PaymentForm
      cards={cards}
      selectedCardId="c1"
      busy={overrides.busy ?? false}
      onCardChange={() => undefined}
      onSubmit={onSubmit}
    />,
  );
  return onSubmit;
}

describe('parseAmount', () => {
  it('given a valid amount when parsed then returns the number', () => {
    expect(parseAmount('100.50')).toEqual({ value: 100.5 });
  });

  it.each(['', 'abc', '-5', '1.234', '0', '0.00'])('given "%s" when parsed then returns an error', (raw) => {
    expect(parseAmount(raw)).toHaveProperty('error');
  });
});

describe('PaymentForm', () => {
  it('given an empty amount when submitting then shows an error and does not submit', async () => {
    const onSubmit = setup();

    await userEvent.click(screen.getByRole('button', { name: 'Pagar' }));

    expect(screen.getByText(/importe válido/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('given a valid amount when submitting then calls onSubmit with the number', async () => {
    const onSubmit = setup();

    await userEvent.type(screen.getByLabelText(/importe/i), '75.25');
    await userEvent.click(screen.getByRole('button', { name: 'Pagar' }));

    expect(onSubmit).toHaveBeenCalledWith(75.25);
  });

  it('given busy state when rendered then the submit button is disabled', () => {
    setup({ busy: true });

    expect(screen.getByRole('button', { name: /procesando/i })).toBeDisabled();
  });
});
