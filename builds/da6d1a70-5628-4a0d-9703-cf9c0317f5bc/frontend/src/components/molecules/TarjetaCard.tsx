import { formatearMonto } from '../../utils/formato';
import type { EstadoTarjeta, Tarjeta } from '../../types/tarjeta';
import { Badge, type Tono } from '../atoms/Badge';

const TONO_POR_ESTADO: Record<EstadoTarjeta, Tono> = {
  ACTIVA: 'ok',
  BLOQUEADA: 'alerta',
  VENCIDA: 'neutro',
};

const ETIQUETA_ESTADO: Record<EstadoTarjeta, string> = {
  ACTIVA: 'Activa',
  BLOQUEADA: 'Bloqueada',
  VENCIDA: 'Vencida',
};

interface TarjetaCardProps {
  tarjeta: Tarjeta;
}

export function TarjetaCard({ tarjeta }: TarjetaCardProps) {
  const esCredito = tarjeta.tipo === 'CREDITO';
  return (
    <article className="tarjeta-card" aria-label={`${tarjeta.marca} ${tarjeta.numeroEnmascarado}`}>
      <header className="tarjeta-card__cabecera">
        <h3>{tarjeta.marca}</h3>
        <Badge texto={ETIQUETA_ESTADO[tarjeta.estado]} tono={TONO_POR_ESTADO[tarjeta.estado]} />
      </header>
      <p className="tarjeta-card__numero">{tarjeta.numeroEnmascarado}</p>
      <dl className="tarjeta-card__datos">
        <dt>Tipo</dt>
        <dd>{esCredito ? 'Crédito' : 'Débito'}</dd>
        <dt>Vence</dt>
        <dd>{tarjeta.venceMesAnio}</dd>
        {esCredito && (
          <>
            <dt>Límite</dt>
            <dd>{formatearMonto(tarjeta.limite, tarjeta.moneda)}</dd>
          </>
        )}
        <dt>Saldo</dt>
        <dd>{formatearMonto(tarjeta.saldo, tarjeta.moneda)}</dd>
      </dl>
    </article>
  );
}
