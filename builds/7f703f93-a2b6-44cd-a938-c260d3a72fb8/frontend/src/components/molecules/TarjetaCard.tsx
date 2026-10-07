import { formatearMonto, type Tarjeta } from '../../model';
import { Badge } from '../atoms/Badge';

interface TarjetaCardProps {
  tarjeta: Tarjeta;
}

export function TarjetaCard({ tarjeta }: TarjetaCardProps) {
  return (
    <article className="card" aria-label={`Tarjeta ${tarjeta.marca} ${tarjeta.numeroEnmascarado}`}>
      <header className="card__header">
        <h3>
          {tarjeta.marca} · {tarjeta.tipo === 'CREDITO' ? 'Crédito' : 'Débito'}
        </h3>
        <Badge estado={tarjeta.estado} />
      </header>
      <p className="card__number">{tarjeta.numeroEnmascarado}</p>
      <dl className="card__data">
        <div>
          <dt>Titular</dt>
          <dd>{tarjeta.titular}</dd>
        </div>
        <div>
          <dt>Vence</dt>
          <dd>{tarjeta.vencimiento}</dd>
        </div>
        <div>
          <dt>Límite</dt>
          <dd>{formatearMonto(tarjeta.limite)}</dd>
        </div>
        <div>
          <dt>Disponible</dt>
          <dd>{formatearMonto(tarjeta.saldoDisponible)}</dd>
        </div>
      </dl>
    </article>
  );
}
