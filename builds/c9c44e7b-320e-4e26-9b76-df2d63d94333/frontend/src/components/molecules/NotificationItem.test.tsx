import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PaymentNotification } from '../../types/notification';
import { NotificationItem } from './NotificationItem';

const base: PaymentNotification = {
  id: 1,
  customerId: 'CUST-001',
  paymentReference: 'PAY-0001',
  type: 'PAYMENT_SUCCESS',
  amount: 125.5,
  currency: 'USD',
  maskedAccount: '****1234',
  status: 'UNREAD',
  createdAt: '2026-01-01T10:00:00Z',
  readAt: null,
};

describe('NotificationItem', () => {
  it('given unread notification when clicking button then calls onMarkRead with id', () => {
    const onMarkRead = vi.fn();
    render(<ul><NotificationItem notification={base} onMarkRead={onMarkRead} /></ul>);

    fireEvent.click(screen.getByRole('button', { name: /marcar como leída/i }));

    expect(onMarkRead).toHaveBeenCalledWith(1);
  });

  it('given read notification then shows read badge and no button', () => {
    render(
      <ul>
        <NotificationItem notification={{ ...base, status: 'READ' }} onMarkRead={vi.fn()} />
      </ul>,
    );

    expect(screen.getByText('Leída')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('given failed payment then shows failed label and masked account', () => {
    render(
      <ul>
        <NotificationItem notification={{ ...base, type: 'PAYMENT_FAILED' }} onMarkRead={vi.fn()} />
      </ul>,
    );

    expect(screen.getByText('Pago fallido')).toBeInTheDocument();
    expect(screen.getByText(/\*\*\*\*1234/)).toBeInTheDocument();
  });
});
