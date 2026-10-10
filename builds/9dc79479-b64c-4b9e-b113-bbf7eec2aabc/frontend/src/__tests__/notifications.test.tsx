import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AccountNotification, NotificationsApi } from '../api/types';
import { NotificationItem } from '../components/molecules/NotificationItem';
import { NotificationsPage } from '../pages/NotificationsPage';

function sample(id: string, isRead: boolean): AccountNotification {
  return {
    id,
    accountMasked: '****1234',
    type: 'DEPOSIT',
    title: `Aviso ${id}`,
    message: 'Mensaje ficticio',
    createdAt: '2026-10-09T12:00:00Z',
    readAt: isRead ? '2026-10-09T13:00:00Z' : null,
    isRead,
  };
}

function fakeApi(items: AccountNotification[]): NotificationsApi {
  return {
    list: vi.fn(async () => items),
    markRead: vi.fn(async () => undefined),
    getPreferences: vi.fn(async () => []),
    savePreferences: vi.fn(async () => undefined),
  };
}

afterEach(() => {
  cleanup();
});

describe('NotificationItem', () => {
  it('given an unread notification, when clicking the button, then it reports its id', () => {
    const onMarkRead = vi.fn();
    render(<NotificationItem notification={sample('a', false)} onMarkRead={onMarkRead} />);

    fireEvent.click(screen.getByRole('button', { name: 'Marcar como leída' }));

    expect(onMarkRead).toHaveBeenCalledWith('a');
  });

  it('given a read notification, then no mark-as-read button is shown and the account is masked', () => {
    render(<NotificationItem notification={sample('b', true)} onMarkRead={vi.fn()} />);

    expect(screen.queryByRole('button', { name: 'Marcar como leída' })).toBeNull();
    expect(screen.getByText('Cuenta ****1234')).toBeTruthy();
  });
});

describe('NotificationsPage', () => {
  it('given two unread notifications, when marking one as read, then the bell counter decreases', async () => {
    const api = fakeApi([sample('1', false), sample('2', false)]);
    render(<NotificationsPage accountId="10020030041234" api={api} />);

    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toBe('2 sin leer');
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'Marcar como leída' })[0]);

    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toBe('1 sin leer');
    });
    expect(api.markRead).toHaveBeenCalledWith('1');
  });

  it('given an API failure, then an error alert is shown', async () => {
    const api = fakeApi([]);
    api.list = vi.fn(async () => {
      throw new Error('boom');
    });
    render(<NotificationsPage accountId="10020030041234" api={api} />);

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toContain('No se pudieron cargar');
    });
  });

  it('given no notifications, then the empty state is shown', async () => {
    render(<NotificationsPage accountId="10020030041234" api={fakeApi([])} />);

    await waitFor(() => {
      expect(screen.getByText('No tienes notificaciones.')).toBeTruthy();
    });
  });
});
