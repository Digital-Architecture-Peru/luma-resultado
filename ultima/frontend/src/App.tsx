import { useEffect, useState } from 'react';
import type { TarjetasApi } from './api/tarjetasApi';
import { FiltroEstadoSelect } from './components/molecules/FiltroEstadoSelect';
import { TarjetaList } from './components/organisms/TarjetaList';
import type { FiltroEstado, Tarjeta } from './model';

type Estado =
  | { fase: 'cargando' }
  | { fase: 'error'; mensaje: string }
  | { fase: 'listo'; tarjetas: Tarjeta[] };

interface AppProps {
  api: TarjetasApi;
}

export function App({ api }: AppProps) {
  const [filtro, setFiltro] = useState<FiltroEstado>('TODAS');
  const [estado, setEstado] = useState<Estado>({ fase: 'cargando' });

  useEffect(() => {
    let vigente = true;
    setEstado({ fase: 'cargando' });
    api
      .listar(filtro)
      .then((tarjetas) => vigente && setEstado({ fase: 'listo', tarjetas }))
      .catch((e: unknown) => {
        if (vigente) {
          setEstado({ fase: 'error', mensaje: e instanceof Error ? e.message : 'Error desconocido.' });
        }
      });
    return () => {
      vigente = false;
    };
  }, [api, filtro]);

  return (
    <main className="page">
      <h1>Mis tarjetas</h1>
      <FiltroEstadoSelect valor={filtro} onChange={setFiltro} />
      <div role="status" aria-live="polite">
        {estado.fase === 'cargando' && 'Cargando tarjetas…'}
      </div>
      {estado.fase === 'error' && (
        <p role="alert" className="error">
          {estado.mensaje}
        </p>
      )}
      {estado.fase === 'listo' && <TarjetaList tarjetas={estado.tarjetas} />}
    </main>
  );
}
