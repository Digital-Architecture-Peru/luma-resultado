import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { NotificacionesApi } from '../services/notificacionesApi';
import type { Notificacion } from '../types/notificacion';
import { useNotificaciones } from './useNotificaciones';

function notificacion(id: string, leida: boolean): Notificacion {
  return {
    id,
    cuenta: '****3344',
    tipo: 'ABONO',
    mensaje: `Mensaje ${id}`,
    monto: 1,
    leida,
    creadaEn: '2026-01-01T10:00:00Z',
  };
}

function crearApi(): NotificacionesApi {
  return {
    listar: vi.fn().mockResolvedValue({
      contenido: [notificacion('a', false), notificacion('b', true)],
      page: 0,
      size: 20,
      total: 2,
    }),
    marcarLeida: vi.fn().mockResolvedValue(notificacion('a', true)),
    obtenerPreferencias: vi.fn().mockResolvedValue([]),
    guardarPreferencia: vi.fn(),
  };
}

describe('useNotificaciones', () => {
  it('given una API que responde, when se monta, then pasa de loading a success con items', async () => {
    const api = crearApi();
    const { result } = renderHook(() => useNotificaciones(api, '0011223344'));

    await waitFor(() => expect(result.current.estado).toBe('success'));

    expect(result.current.items).toHaveLength(2);
    expect(api.listar).toHaveBeenCalledWith('0011223344', { leida: undefined, page: 0, size: 20 });
  });

  it('given una API que falla, when se monta, then estado error con mensaje', async () => {
    const api = crearApi();
    api.listar = vi.fn().mockRejectedValue(new Error('Sin conexión'));
    const { result } = renderHook(() => useNotificaciones(api, '0011223344'));

    await waitFor(() => expect(result.current.estado).toBe('error'));

    expect(result.current.error).toBe('Sin conexión');
  });

  it('given items cargados, when marcarLeida, then reemplaza el item actualizado', async () => {
    const api = crearApi();
    const { result } = renderHook(() => useNotificaciones(api, '0011223344'));
    await waitFor(() => expect(result.current.estado).toBe('success'));

    await act(async () => {
      await result.current.marcarLeida('a');
    });

    expect(api.marcarLeida).toHaveBeenCalledWith('a');
    expect(result.current.items.find((n) => n.id === 'a')?.leida).toBe(true);
  });

  it('given marcarLeida que falla, when se ejecuta, then conserva la lista y expone errorAccion', async () => {
    const api = crearApi();
    api.marcarLeida = vi.fn().mockRejectedValue(new Error('Fallo al marcar'));
    const { result } = renderHook(() => useNotificaciones(api, '0011223344'));
    await waitFor(() => expect(result.current.estado).toBe('success'));

    await act(async () => {
      await result.current.marcarLeida('a');
    });

    expect(result.current.errorAccion).toBe('Fallo al marcar');
    expect(result.current.items).toHaveLength(2);
  });

  it('given el filtro solo no leídas, when se activa, then consulta con leida=false', async () => {
    const api = crearApi();
    const { result } = renderHook(() => useNotificaciones(api, '0011223344'));
    await waitFor(() => expect(result.current.estado).toBe('success'));

    act(() => {
      result.current.setSoloNoLeidas(true);
    });

    await waitFor(() =>
      expect(api.listar).toHaveBeenLastCalledWith('0011223344', { leida: false, page: 0, size: 20 }),
    );
  });
});
