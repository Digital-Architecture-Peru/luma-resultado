import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { AmountInput } from '../components/atoms/AmountInput';
import { isPositiveAmount } from '../utils/amount';

function Harness() {
  const [value, setValue] = useState('');
  return (
    <>
      <label htmlFor="amt">Monto</label>
      <AmountInput id="amt" value={value} onChange={setValue} />
    </>
  );
}

describe('AmountInput', () => {
  it('given invalid characters when typing then they are rejected', async () => {
    render(<Harness />);
    await userEvent.type(screen.getByLabelText('Monto'), 'a1b2');
    expect(screen.getByLabelText('Monto')).toHaveValue('12');
  });

  it('given a third decimal when typing then it is rejected', async () => {
    render(<Harness />);
    await userEvent.type(screen.getByLabelText('Monto'), '12.345');
    expect(screen.getByLabelText('Monto')).toHaveValue('12.34');
  });
});

describe('isPositiveAmount', () => {
  it('accepts positive amounts with up to two decimals', () => {
    expect(isPositiveAmount('10')).toBe(true);
    expect(isPositiveAmount('10.5')).toBe(true);
  });

  it('rejects zero, empty and malformed amounts', () => {
    expect(isPositiveAmount('0')).toBe(false);
    expect(isPositiveAmount('0.00')).toBe(false);
    expect(isPositiveAmount('')).toBe(false);
    expect(isPositiveAmount('1.')).toBe(false);
  });
});
