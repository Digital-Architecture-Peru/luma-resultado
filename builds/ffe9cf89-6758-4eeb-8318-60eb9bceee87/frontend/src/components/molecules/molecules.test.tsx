import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CardNotification } from '../../types/notification';
import NotificationItem from './NotificationItem';
import PreferenceToggle from './PreferenceToggle';

const base: CardNotification = {
  id: 'n1',
  cardId: 'c1',
  type: 'COMPRA',
  title: 'Compra en comercio ficticio',
  message: 'Detalle',
  amount: 125.5,
  currency: 'USD',
  status: 'UNREAD',
  createdAt: '2026-01-01T10:00:00Z',
  readAt: null,
};

describe('NotificationItem', () => {
  it('given an unread notification, when clicking the action, then calls onMarkRead with its id', async () => {
    const onMarkRead = vi.fn();
    render(<ul><NotificationItem notification={base} onMarkRead={onMarkRead} /></ul>);

    await userEvent.click(screen.getByRole('button', { name: /Marcar como leída/ }));

    expect(onMarkRead).toHaveBeenCalledWith('n1');
    expect(screen.getByText('No leída')).toBeInTheDocument();
  });

  it('given a read notification, when rendering, then hides the action', () => {
    render(<ul><NotificationItem notification={{ ...base, status: 'READ' }} onMarkRead={vi.fn()} /></ul>);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Leída')).toBeInTheDocument();
  });

  it('given no amount, when rendering, then shows no amount', () => {
    render(<ul><NotificationItem notification={{ ...base, amount: null, currency: null }} onMarkRead={vi.fn()} /></ul>);

    expect(screen.queryByText(/US\$|USD/)).not.toBeInTheDocument();
  });
});

describe('PreferenceToggle', () => {
  it('given a label, when toggled, then calls onChange', async () => {
    const onChange = vi.fn();
    render(<PreferenceToggle label="Compra por Correo" checked={false} onChange={onChange} />);

    await userEvent.click(screen.getByLabelText('Compra por Correo'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
