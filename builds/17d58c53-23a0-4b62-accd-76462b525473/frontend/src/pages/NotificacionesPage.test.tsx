import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { NotificacionesApi } from '../services/notificacionesApi';
import type { Notificacion, Preferencia } from '../types/notificacion';
import { NotificacionesPage } from './NotificacionesPage';

const nueva: Notificacion = {
  id: 'n-1',
  cuenta: '****3344',
  tipo: 'ABONO',
  mensaje: 'Abono recibido',
  monto: 1500,
  leida: false,
  creadaEn: '2026-01-01T10:00:00Z',
};

const preferencia: Preferencia = { tipo: 'CARGO', canal: 'SMS', activo: true, umbralMonto: 200 };

function crearApi(): NotificacionesApi {
  return {
    listar: vi.fn().mockResolvedValue({ contenido: [nueva], page: 0, size: 20, total: 1 }),
    marcarLeida: vi.fn().mockResolvedValue({ ...nueva, leida: true }),
    obtenerPreferencias: vi.fn().mockResolvedValue([preferencia]),
    guardarPreferencia: vi.fn().mockResolvedValue({ ...preferencia, activo: false }),
  };
}

describe('NotificacionesPage', () => {
  it('given datos del API, when carga, then muestra notificaciones, contador y preferencias', async () => {
    render(<NotificacionesPage api={crearApi()} cuentaId="0011223344" />);

    expect(await screen.findByText('Abono recibido')).toBeInTheDocument();
    expect(screen.getByText('Sin leer: 1')).toBeInTheDocument();
    expect(await screen.findByLabelText('Cargo por SMS')).toBeChecked();
  });

  it('given una notificación nueva, when se marca como leída, then el contador baja a 0', async () => {
    const api = crearApi();
    render(<NotificacionesPage api={api} cuentaId="0011223344" />);

    await userEvent.click(await screen.findByRole('button', { name: /marcar como leída/i }));

    await waitFor(() => expect(screen.getByText('Sin leer: 0')).toBeInTheDocument());
    expect(api.marcarLeida).toHaveBeenCalledWith('n-1');
  });

  it('given una preferencia activa, when se desmarca, then se guarda con activo=false', async () => {
    const api = crearApi();
    render(<NotificacionesPage api={api} cuentaId="0011223344" />);

    await userEvent.click(await screen.findByLabelText('Cargo por SMS'));

    await waitFor(() =>
      expect(api.guardarPreferencia).toHaveBeenCalledWith('0011223344', { ...preferencia, activo: false }),
    );
  });
});
