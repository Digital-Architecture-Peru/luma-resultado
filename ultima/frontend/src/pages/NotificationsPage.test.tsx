import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { NotificationsApi } from '../services/notificationsApi';
import type { PaymentNotification } from '../types/notification';
import { NotificationsPage } from './NotificationsPage';

const unread: PaymentNotification = {
  id: 1,
  customerId: 'CUST-001',
  paymentReference: 'PAY-0001',
  type: 'PAYMENT_SUCCESS',
  amount: 10,
  currency: 'USD',
  maskedAccount: '****1234',
  status: 'UNREAD',
  createdAt: '2026-01-01T10:00:00Z',
  readAt: null,
};

function fakeApi(overrides: Partial<NotificationsApi> = {}): NotificationsApi {
  return {
    list: vi.fn().mockResolvedValue([unread]),
    markAsRead: vi.fn().mockResolvedValue({ ...unread, status: 'READ', readAt: '2026-01-01T11:00:00Z' }),
    ...overrides,
  };
}

describe('NotificationsPage', () => {
  it('given api data when loaded then lists notifications and unread count', async () => {
    render(<NotificationsPage api={fakeApi()} pollMs={0} />);

    expect(await screen.findByText('Pago exitoso')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Notificaciones sin leer: 1');
  });

  it('given unread item when marking as read then count drops to zero', async () => {
    const api = fakeApi();
    render(<NotificationsPage api={api} pollMs={0} />);

    fireEvent.click(await screen.findByRole('button', { name: /marcar como leída/i }));

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Notificaciones sin leer: 0'));
    expect(api.markAsRead).toHaveBeenCalledWith(1);
  });

  it('given api failure when loading then shows alert with retry', async () => {
    const api = fakeApi({ list: vi.fn().mockRejectedValue(new Error('boom')) });
    render(<NotificationsPage api={api} pollMs={0} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron cargar');
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
  });

  it('given empty list when loaded then shows empty message', async () => {
    render(<NotificationsPage api={fakeApi({ list: vi.fn().mockResolvedValue([]) })} pollMs={0} />);

    expect(await screen.findByText(/no tienes notificaciones/i)).toBeInTheDocument();
  });
});
