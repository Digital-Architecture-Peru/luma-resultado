import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CardNotification } from '../../api/types';
import { NotificationList } from './NotificationList';

const item = (id: string, readAt: string | null): CardNotification => ({
  id,
  cardLast4: '9876',
  type: 'LimitChanged',
  title: `Aviso ${id}`,
  body: 'Detalle',
  severity: 'Warning',
  createdAt: '2026-10-09T12:00:00Z',
  readAt,
});

describe('NotificationList', () => {
  it('given no items, when rendered, then shows the empty state and "Todo al día"', () => {
    render(<NotificationList items={[]} unread={0} onMarkRead={vi.fn()} onMarkAllRead={vi.fn()} />);

    expect(screen.getByText('No tienes notificaciones.')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Todo al día');
    expect(screen.getByRole('button', { name: 'Marcar todas como leídas' })).toBeDisabled();
  });

  it('given unread items, when rendered, then announces the unread count and lists every item', () => {
    render(
      <NotificationList items={[item('a', null), item('b', null)]} unread={2} onMarkRead={vi.fn()} onMarkAllRead={vi.fn()} />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('2 sin leer');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('given unread items, when mark-all is clicked, then calls onMarkAllRead', async () => {
    const onMarkAllRead = vi.fn();
    render(<NotificationList items={[item('a', null)]} unread={1} onMarkRead={vi.fn()} onMarkAllRead={onMarkAllRead} />);

    await userEvent.click(screen.getByRole('button', { name: 'Marcar todas como leídas' }));

    expect(onMarkAllRead).toHaveBeenCalledTimes(1);
  });
});
