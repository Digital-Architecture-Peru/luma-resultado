import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Amount } from './Amount';

describe('Amount', () => {
  it('given amount and currency then renders both', () => {
    render(<Amount amount="10.00" currency="EUR" />);
    expect(screen.getByText('10.00 EUR')).toBeInTheDocument();
  });
});
