import { useMemo } from 'react';
import { ListaTarjetas } from '../components/organisms/ListaTarjetas';
import { PaginaLayout } from '../components/templates/PaginaLayout';
import { useTarjetas } from '../hooks/useTarjetas';
import { crearTarjetasApiDesdeEntorno } from '../services/tarjetasApi';
import type { TarjetasApi } from '../types/tarjeta';

interface ConsultaTarjetasPageProps {
  api?: TarjetasApi;
}

export function ConsultaTarjetasPage({ api }: ConsultaTarjetasPageProps) {
  const servicio = useMemo(() => api ?? crearTarjetasApiDesdeEntorno(), [api]);
  const { estado, tarjetas, error, recargar } = useTarjetas(servicio);

  return (
    <PaginaLayout titulo="Mis tarjetas">
      <ListaTarjetas estado={estado} tarjetas={tarjetas} error={error} onReintentar={recargar} />
    </PaginaLayout>
  );
}
