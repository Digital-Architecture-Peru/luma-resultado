import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import NotificationItem from '../src/lib/components/molecules/NotificationItem.svelte';
import NotificationCenter from '../src/lib/components/organisms/NotificationCenter.svelte';
import { createNotificationStore } from '../src/lib/stores/notificationStore';
import { InMemoryNotificationGateway } from '../src/lib/services/notificationGateway';
import type { CardNotification } from '../src/lib/model/notification';

const sample: CardNotification = {
  id: 'x-1',
  cardLast4: '4321',
  type: 'purchase',
  message: 'Compra de prueba',
  createdAt: '2026-10-07T09:15:00Z',
  read: false,
};

describe('NotificationItem', () => {
  it('given no leída when se renderiza then muestra tarjeta enmascarada y llama onRead al pulsar', async () => {
    const onRead = vi.fn();
    render(NotificationItem, { props: { notification: sample, onRead } });
    expect(screen.getByText('•••• 4321')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Marcar como leída' }));
    expect(onRead).toHaveBeenCalledWith('x-1');
  });

  it('given leída when se renderiza then no ofrece marcar como leída', () => {
    render(NotificationItem, { props: { notification: { ...sample, read: true } } });
    expect(screen.queryByRole('button', { name: 'Marcar como leída' })).toBeNull();
  });
});

describe('NotificationCenter', () => {
  it('given datos when carga then informa no leídas y las actualiza al marcar todas', async () => {
    const store = createNotificationStore(new InMemoryNotificationGateway());
    render(NotificationCenter, { props: { store } });
    expect(await screen.findByText('Tienes 2 sin leer')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Marcar todas como leídas' }));
    expect(await screen.findByText('No tienes notificaciones sin leer')).toBeInTheDocument();
  });
});
