import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PaymentNotification } from '../../types/notification';
import { NotificationItem } from './NotificationItem';

const base: PaymentNotification = {
  id: 'n-1',
  paymentRef: '****1234',
  type: 'PAYMENT_REJECTED',
  title: 'Pago rechazado',
  body: 'Fondos insuficientes.',
  amount: 10,
  currency: 'USD',
  createdAt: '2026-01-01T10:00:00Z',
  readAt: null,
};

describe('NotificationItem', () => {
  it('given an unread notification, when the button is clicked, then onMarkRead receives its id', () => {
    const onMarkRead = vi.fn();
    render(<ul><NotificationItem notification={base} onMarkRead={onMarkRead} /></ul>);

    fireEvent.click(screen.getByRole('button'));

    expect(onMarkRead).toHaveBeenCalledWith('n-1');
  });

  it('given a read notification, when rendered, then there is no mark-as-read button', () => {
    render(<ul><NotificationItem notification={{ ...base, readAt: '2026-01-02T10:00:00Z' }} onMarkRead={vi.fn()} /></ul>);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('given a rejected payment, when rendered, then shows the masked reference and status label', () => {
    render(<ul><NotificationItem notification={base} onMarkRead={vi.fn()} /></ul>);

    expect(screen.getByText('Rechazado')).toBeTruthy();
    expect(screen.getByText(/\*\*\*\*1234/)).toBeTruthy();
  });
});
