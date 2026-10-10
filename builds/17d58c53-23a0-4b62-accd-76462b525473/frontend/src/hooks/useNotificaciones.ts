import { useCallback, useEffect, useState } from 'react';
import type { NotificacionesApi } from '../services/notificacionesApi';
import type { EstadoRemoto, Notificacion } from '../types/notificacion';

const TAMANO_PAGINA = 20;

export function mensajeDeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Error inesperado';
}

export function useNotificaciones(api: NotificacionesApi, cuentaId: string) {
  const [estado, setEstado] = useState<EstadoRemoto>('idle');
  const [items, setItems] = useState<Notificacion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const [soloNoLeidas, setSoloNoLeidas] = useState(false);

  useEffect(() => {
    let cancelado = false;
    setEstado('loading');
    api
      .listar(cuentaId, { leida: soloNoLeidas ? false : undefined, page: 0, size: TAMANO_PAGINA })
      .then((pagina) => {
        if (cancelado) return;
        setItems(pagina.contenido);
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
  }, [api, cuentaId, soloNoLeidas]);

  const marcarLeida = useCallback(
    async (id: string) => {
      try {
        const actualizada = await api.marcarLeida(id);
        setErrorAccion(null);
        setItems((prev) =>
          soloNoLeidas ? prev.filter((n) => n.id !== id) : prev.map((n) => (n.id === id ? actualizada : n)),
        );
      } catch (e: unknown) {
        setErrorAccion(mensajeDeError(e));
      }
    },
    [api, soloNoLeidas],
  );

  return { estado, items, error, errorAccion, soloNoLeidas, setSoloNoLeidas, marcarLeida };
}
