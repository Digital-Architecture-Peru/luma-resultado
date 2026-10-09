import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CardNotification } from '../../api/types';
import { NotificationItem } from './NotificationItem';

const base: CardNotification = {
  id: 'n-1',
  cardLast4: '1234',
  type: 'PurchaseApproved',
  title: 'Compra aprobada',
  body: 'Se aprobó una compra con la tarjeta terminada en 1234.',
  severity: 'Info',
  createdAt: '2026-10-09T12:00:00Z',
  readAt: null,
};

describe('NotificationItem', () => {
  it('given an unread notification, when rendered, then shows masked card and mark-as-read button', () => {
    render(<ul><NotificationItem notification={base} onMarkRead={vi.fn()} /></ul>);

    expect(screen.getByText('•••• 1234')).toBeInTheDocument();
    expect(screen.getByText('Informativa')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Marcar como leída' })).toBeInTheDocument();
  });

  it('given an unread notification, when the button is clicked, then calls onMarkRead with its id', async () => {
    const onMarkRead = vi.fn();
    render(<ul><NotificationItem notification={base} onMarkRead={onMarkRead} /></ul>);

    await userEvent.click(screen.getByRole('button', { name: 'Marcar como leída' }));

    expect(onMarkRead).toHaveBeenCalledTimes(1);
    expect(onMarkRead).toHaveBeenCalledWith('n-1');
  });

  it('given a read notification, when rendered, then has no mark-as-read button', () => {
    render(<ul><NotificationItem notification={{ ...base, readAt: '2026-10-09T13:00:00Z' }} onMarkRead={vi.fn()} /></ul>);

    expect(screen.queryByRole('button', { name: 'Marcar como leída' })).not.toBeInTheDocument();
  });
});
