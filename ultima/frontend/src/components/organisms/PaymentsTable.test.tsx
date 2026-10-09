import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Payment } from '../../api/types';
import { PaymentsTable } from './PaymentsTable';

const sample: Payment = {
  id: '1',
  beneficiary: 'Luz del Norte',
  accountMasked: '****1222',
  amount: '1601.00',
  currency: 'USD',
  status: 'COMPLETED',
  paidAt: '2026-09-07T10:00:00+00:00',
  reference: 'REF-1',
};

describe('PaymentsTable', () => {
  it('given payments when rendered then shows row data with masked account', () => {
    render(<PaymentsTable payments={[sample]} />);

    expect(screen.getByText('Luz del Norte')).toBeInTheDocument();
    expect(screen.getByText('****1222')).toBeInTheDocument();
    expect(screen.getByText('1,601.00 USD')).toBeInTheDocument();
    expect(screen.getByText('Completado')).toBeInTheDocument();
  });

  it('given no payments when rendered then shows empty message', () => {
    render(<PaymentsTable payments={[]} />);

    expect(screen.getByText(/No hay pagos/)).toBeInTheDocument();
  });
});
