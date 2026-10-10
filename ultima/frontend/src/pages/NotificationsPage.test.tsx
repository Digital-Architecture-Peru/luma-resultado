import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createMockApi } from '../services/mockNotificationsApi';
import { NotificationsPage } from './NotificationsPage';

describe('NotificationsPage', () => {
  it('given unread notifications, when loaded, then the bell shows the unread count', async () => {
    render(<NotificationsPage api={createMockApi()} />);

    expect(await screen.findByLabelText('3 notificaciones sin leer')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('given an unread notification, when marked as read, then the count decreases', async () => {
    render(<NotificationsPage api={createMockApi()} />);
    await screen.findByLabelText('3 notificaciones sin leer');

    fireEvent.click(screen.getAllByRole('button', { name: /Marcar como leída/ })[0]);

    await waitFor(() => expect(screen.getByLabelText('2 notificaciones sin leer')).toBeTruthy());
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('given the "all" filter, when selected, then read notifications are listed too', async () => {
    render(<NotificationsPage api={createMockApi()} />);
    await screen.findByLabelText('3 notificaciones sin leer');

    fireEvent.click(screen.getByRole('button', { name: 'Todas' }));

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(4));
  });
});
