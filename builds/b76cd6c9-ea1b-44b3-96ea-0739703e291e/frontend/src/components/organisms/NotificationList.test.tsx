import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { sampleNotifications } from '../../services/mockNotificationsApi';
import { NotificationList } from './NotificationList';

describe('NotificationList', () => {
  it('given loading status, when rendered, then announces loading', () => {
    render(<NotificationList items={[]} status="loading" onMarkRead={vi.fn()} onRetry={vi.fn()} />);
    expect(screen.getByRole('status').textContent).toContain('Cargando');
  });

  it('given error status, when retry is clicked, then onRetry is called', () => {
    const onRetry = vi.fn();
    render(<NotificationList items={[]} status="error" onMarkRead={vi.fn()} onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('given no items, when rendered, then shows the empty state', () => {
    render(<NotificationList items={[]} status="success" onMarkRead={vi.fn()} onRetry={vi.fn()} />);
    expect(screen.getByText('No tienes notificaciones para mostrar.')).toBeTruthy();
  });

  it('given items, when rendered, then lists each notification', () => {
    const items = sampleNotifications();
    render(<NotificationList items={items} status="success" onMarkRead={vi.fn()} onRetry={vi.fn()} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(items.length);
  });
});
