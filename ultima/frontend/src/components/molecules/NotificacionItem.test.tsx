import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Notificacion } from '../../types/notificacion';
import { NotificacionItem } from './NotificacionItem';

const base: Notificacion = {
  id: 'n-1',
  cuenta: '****3344',
  tipo: 'CARGO',
  mensaje: 'Cargo por compra',
  monto: 89.9,
  leida: false,
  creadaEn: '2026-01-01T10:00:00Z',
};

describe('NotificacionItem', () => {
  it('given una notificación nueva, when se renderiza, then muestra datos y estado Nueva', () => {
    render(<ul><NotificacionItem notificacion={base} onMarcarLeida={vi.fn()} /></ul>);

    expect(screen.getByText('Cargo por compra')).toBeInTheDocument();
    expect(screen.getByText('Cuenta ****3344')).toBeInTheDocument();
    expect(screen.getByText('Monto: 89.90')).toBeInTheDocument();
    expect(screen.getByText('Nueva')).toBeInTheDocument();
  });

  it('given una notificación nueva, when se pulsa el botón, then notifica el id', async () => {
    const onMarcarLeida = vi.fn();
    render(<ul><NotificacionItem notificacion={base} onMarcarLeida={onMarcarLeida} /></ul>);

    await userEvent.click(screen.getByRole('button', { name: /marcar como leída/i }));

    expect(onMarcarLeida).toHaveBeenCalledWith('n-1');
  });

  it('given una notificación leída sin monto, when se renderiza, then no ofrece el botón ni el monto', () => {
    render(<ul><NotificacionItem notificacion={{ ...base, leida: true, monto: null }} onMarcarLeida={vi.fn()} /></ul>);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByText(/Monto:/)).not.toBeInTheDocument();
    expect(screen.getByText('Leída')).toBeInTheDocument();
  });
});
