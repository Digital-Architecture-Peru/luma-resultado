import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import NotificationItem from '../src/lib/components/molecules/NotificationItem.svelte';

const notification = (over = {}) => ({
  id: 'n1',
  type: 'compra',
  cardLast4: '1234',
  title: 'Compra aprobada',
  body: 'Compra en Tienda Demo.',
  amount: 10,
  createdAt: '2026-01-01T10:00:00Z',
  read: false,
  ...over
});

describe('NotificationItem', () => {
  it('given an unread notification then shows masked card and action', () => {
    render(NotificationItem, { notification: notification() });
    expect(screen.getByText('Compra aprobada')).toBeInTheDocument();
    expect(screen.getByTestId('card-chip')).toHaveTextContent('•••• 1234');
    expect(screen.getByRole('button', { name: 'Marcar como leída' })).toBeInTheDocument();
  });

  it('given a read notification then no action button', () => {
    render(NotificationItem, { notification: notification({ read: true }) });
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('when clicking the button then emits read with the id', async () => {
    const { component } = render(NotificationItem, { notification: notification() });
    const handler = vi.fn();
    component.$on('read', handler);
    await fireEvent.click(screen.getByRole('button', { name: 'Marcar como leída' }));
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail).toBe('n1');
  });
});
