import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CardNotificationsApi } from '../api/cardNotificationsClient';
import type { NotificationPage, Preference } from '../api/types';
import { NotificationsPage } from './NotificationsPage';

const unreadPage: NotificationPage = {
  items: [
    {
      id: 'n-1',
      cardLast4: '1234',
      type: 'PurchaseApproved',
      title: 'Compra aprobada',
      body: 'Detalle',
      severity: 'Info',
      createdAt: '2026-10-09T12:00:00Z',
      readAt: null,
    },
  ],
  unread: 1,
  page: 1,
  size: 20,
};
const readPage: NotificationPage = { items: [{ ...unreadPage.items[0], readAt: '2026-10-09T13:00:00Z' }], unread: 0, page: 1, size: 20 };
const preferences: Preference[] = [{ eventType: 'LimitChanged', channel: 'Email', enabled: false }];

// El título de la notificación es un h3; la etiqueta homónima de preferencias es una leyenda.
const notificationTitle = () => screen.findByRole('heading', { level: 3, name: /Compra aprobada/ });

function fakeApi(overrides: Partial<CardNotificationsApi> = {}): CardNotificationsApi {
  return {
    list: vi.fn().mockResolvedValue(unreadPage),
    markRead: vi.fn().mockResolvedValue(undefined),
    markAllRead: vi.fn().mockResolvedValue(1),
    getPreferences: vi.fn().mockResolvedValue(preferences),
    savePreferences: vi.fn().mockResolvedValue(preferences),
    ...overrides,
  };
}

describe('NotificationsPage', () => {
  it('given the API responds, when loaded, then lists notifications and the unread count', async () => {
    render(<NotificationsPage api={fakeApi()} />);

    expect(await notificationTitle()).toBeInTheDocument();
    expect(await screen.findByText('1 sin leer')).toBeInTheDocument();
  });

  it('given an unread item, when marked as read, then reloads and shows "Todo al día"', async () => {
    const list = vi.fn().mockResolvedValueOnce(unreadPage).mockResolvedValue(readPage);
    const api = fakeApi({ list });
    render(<NotificationsPage api={api} />);

    await userEvent.click(await screen.findByRole('button', { name: 'Marcar como leída' }));

    expect(api.markRead).toHaveBeenCalledWith('n-1');
    expect(await screen.findByText('Todo al día')).toBeInTheDocument();
  });

  it('given the list request fails, when loaded, then shows an alert with retry', async () => {
    const list = vi.fn().mockRejectedValueOnce(new Error('Servicio no disponible')).mockResolvedValue(unreadPage);
    render(<NotificationsPage api={fakeApi({ list })} />);

    expect(await screen.findByText(/Servicio no disponible/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(await notificationTitle()).toBeInTheDocument();
  });

  it('given the unread filter, when selected, then requests only unread notifications', async () => {
    const api = fakeApi();
    render(<NotificationsPage api={api} />);
    await notificationTitle();

    await userEvent.click(screen.getByRole('button', { name: 'Sin leer' }));

    await waitFor(() => expect(api.list).toHaveBeenLastCalledWith('unread'));
  });
});
