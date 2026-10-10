import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Notificacion } from '../../types/notificacion';
import { NotificacionesList } from './NotificacionesList';

const item: Notificacion = {
  id: 'n-1',
  cuenta: '****3344',
  tipo: 'ABONO',
  mensaje: 'Abono recibido',
  monto: 10,
  leida: false,
  creadaEn: '2026-01-01T10:00:00Z',
};

describe('NotificacionesList', () => {
  it('given estado loading, when se renderiza, then anuncia la carga con role=status', () => {
    render(<NotificacionesList estado="loading" items={[]} error={null} onMarcarLeida={vi.fn()} />);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando');
  });

  it('given estado error, when se renderiza, then muestra alerta con el motivo', () => {
    render(<NotificacionesList estado="error" items={[]} error="Servidor caído" onMarcarLeida={vi.fn()} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Servidor caído');
  });

  it('given éxito sin elementos, when se renderiza, then muestra estado vacío', () => {
    render(<NotificacionesList estado="success" items={[]} error={null} onMarcarLeida={vi.fn()} />);
    expect(screen.getByRole('status')).toHaveTextContent('No tienes notificaciones');
  });

  it('given éxito con elementos, when se renderiza, then lista cada notificación', () => {
    render(<NotificacionesList estado="success" items={[item]} error={null} onMarcarLeida={vi.fn()} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('Abono recibido')).toBeInTheDocument();
  });
});
