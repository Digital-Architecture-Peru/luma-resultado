import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import NotificationList from '../src/lib/components/organisms/NotificationList.svelte';
import NotificationBanner from '../src/lib/components/organisms/NotificationBanner.svelte';

const mk = (id, read = false) => ({
  id,
  type: 'limite',
  cardLast4: '9876',
  title: `Título ${id}`,
  body: 'Cuerpo',
  createdAt: '2026-01-01T10:00:00Z',
  read
});

describe('NotificationList', () => {
  it('given empty items then shows empty state', () => {
    render(NotificationList, { items: [] });
    expect(screen.getByText('No tienes notificaciones.')).toBeInTheDocument();
  });

  it('given items then renders one list item each', () => {
    render(NotificationList, { items: [mk('a'), mk('b', true)] });
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});

describe('NotificationBanner', () => {
  it('given unread count then status announces it', () => {
    render(NotificationBanner, { unread: 2 });
    expect(screen.getByRole('status')).toHaveTextContent('Tienes 2 notificaciones sin leer');
  });

  it('given zero unread then mark-all is disabled', () => {
    render(NotificationBanner, { unread: 0 });
    expect(screen.getByRole('status')).toHaveTextContent('Estás al día');
    expect(screen.getByRole('button', { name: 'Marcar todas como leídas' })).toBeDisabled();
  });
});
