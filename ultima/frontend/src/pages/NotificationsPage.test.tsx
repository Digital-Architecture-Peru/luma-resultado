import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { NotificationsApi } from '../services/notificationsApi';
import type { CardNotification, Preference } from '../types/notification';
import NotificationsPage from './NotificationsPage';

const unread: CardNotification = {
  id: 'n1',
  cardId: 'c1',
  type: 'COMPRA',
  title: 'Compra en comercio ficticio',
  message: 'Detalle',
  amount: 10,
  currency: 'USD',
  status: 'UNREAD',
  createdAt: '2026-01-01T10:00:00Z',
  readAt: null,
};

const prefs: Preference[] = [{ type: 'PAGO', channel: 'EMAIL', enabled: false }];

function fakeApi(overrides: Partial<NotificationsApi> = {}): NotificationsApi {
  return {
    listCards: vi.fn().mockResolvedValue([{ id: 'c1', brand: 'VISA', alias: 'Visa Platinum', panLast4: '1111' }]),
    listNotifications: vi.fn().mockResolvedValue({ items: [unread], page: 0, size: 20, total: 1 }),
    markRead: vi.fn().mockResolvedValue({ ...unread, status: 'READ', readAt: '2026-01-01T11:00:00Z' }),
    getPreferences: vi.fn().mockResolvedValue(prefs),
    updatePreferences: vi.fn().mockResolvedValue([{ ...prefs[0], enabled: true }]),
    ...overrides,
  };
}

describe('NotificationsPage', () => {
  it('given a card with notifications, when loaded, then lists them', async () => {
    render(<NotificationsPage api={fakeApi()} />);

    expect(await screen.findByText('Compra en comercio ficticio')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Visa Platinum/ })).toBeInTheDocument();
  });

  it('given an unread notification, when marking it read, then shows it as read', async () => {
    const api = fakeApi();
    render(<NotificationsPage api={api} />);

    await userEvent.click(await screen.findByRole('button', { name: /Marcar como leída/ }));

    expect(api.markRead).toHaveBeenCalledWith('n1');
    expect(await screen.findByText('Leída')).toBeInTheDocument();
  });

  it('given a failing list, when loading, then shows the error', async () => {
    const api = fakeApi({ listNotifications: vi.fn().mockRejectedValue(new Error('Servicio no disponible')) });
    render(<NotificationsPage api={api} />);

    expect(await screen.findByText('Servicio no disponible')).toBeInTheDocument();
  });

  it('given preferences, when toggling and saving, then sends the updated matrix', async () => {
    const api = fakeApi();
    render(<NotificationsPage api={api} />);

    await userEvent.click(await screen.findByLabelText('Pago por Correo'));
    await userEvent.click(screen.getByRole('button', { name: 'Guardar preferencias' }));

    expect(api.updatePreferences).toHaveBeenCalledWith('c1', [{ type: 'PAGO', channel: 'EMAIL', enabled: true }]);
    expect(await screen.findByText('Preferencias guardadas')).toBeInTheDocument();
  });
});
