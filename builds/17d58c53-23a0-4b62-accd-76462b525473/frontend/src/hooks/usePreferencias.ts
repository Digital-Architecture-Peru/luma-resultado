import { useCallback, useEffect, useState } from 'react';
import type { NotificacionesApi } from '../services/notificacionesApi';
import type { EstadoRemoto, Preferencia } from '../types/notificacion';
import { mensajeDeError } from './useNotificaciones';

export function usePreferencias(api: NotificacionesApi, cuentaId: string) {
  const [estado, setEstado] = useState<EstadoRemoto>('idle');
  const [preferencias, setPreferencias] = useState<Preferencia[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    setEstado('loading');
    api
      .obtenerPreferencias(cuentaId)
      .then((lista) => {
        if (cancelado) return;
        setPreferencias(lista);
        setError(null);
        setEstado('success');
      })
      .catch((e: unknown) => {
        if (cancelado) return;
        setError(mensajeDeError(e));
        setEstado('error');
      });
    return () => {
      cancelado = true;
    };
  }, [api, cuentaId]);

  const guardar = useCallback(
    async (nueva: Preferencia) => {
      try {
        const guardada = await api.guardarPreferencia(cuentaId, nueva);
        setError(null);
        setPreferencias((prev) =>
          prev.map((p) => (p.tipo === guardada.tipo && p.canal === guardada.canal ? guardada : p)),
        );
      } catch (e: unknown) {
        setError(mensajeDeError(e));
      }
    },
    [api, cuentaId],
  );

  return { estado, preferencias, error, guardar };
}
