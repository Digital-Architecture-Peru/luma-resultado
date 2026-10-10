import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AmountText, formatAmount } from './AmountText';

describe('AmountText', () => {
  it('given an amount and currency, when formatted, then shows grouped decimals', () => {
    expect(formatAmount(1250.5, 'USD')).toBe('$1,250.50');
  });

  it('given props, when rendered, then displays the formatted amount', () => {
    render(<AmountText amount={80} currency="USD" />);
    expect(screen.getByText('$80.00')).toBeTruthy();
  });
});
