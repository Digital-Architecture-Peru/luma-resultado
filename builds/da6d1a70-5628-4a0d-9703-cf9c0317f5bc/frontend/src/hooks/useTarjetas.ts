import { useCallback, useEffect, useState } from 'react';
import type { Tarjeta, TarjetasApi } from '../types/tarjeta';

export type EstadoCarga = 'loading' | 'success' | 'error';

export interface UseTarjetas {
  estado: EstadoCarga;
  tarjetas: Tarjeta[];
  error: string | null;
  recargar: () => void;
}

export function useTarjetas(api: TarjetasApi): UseTarjetas {
  const [estado, setEstado] = useState<EstadoCarga>('loading');
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let activo = true;
    setEstado('loading');
    api
      .listar()
      .then((pagina) => {
        if (!activo) return;
        setTarjetas(pagina.items);
        setError(null);
        setEstado('success');
      })
      .catch((e: unknown) => {
        if (!activo) return;
        setError(e instanceof Error ? e.message : 'Error desconocido');
        setEstado('error');
      });
    return () => {
      activo = false;
    };
  }, [api, version]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  return { estado, tarjetas, error, recargar };
}
