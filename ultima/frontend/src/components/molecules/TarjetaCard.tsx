import type { Tarjeta } from "../../model/tarjeta";
import { formatearMonto, porcentajeUtilizado } from "../../utils/format";
import { Badge } from "../atoms/Badge";
import { ProgressBar } from "../atoms/ProgressBar";

export function TarjetaCard({ tarjeta }: { tarjeta: Tarjeta }) {
  const usado = porcentajeUtilizado(tarjeta.limite, tarjeta.saldoDisponible);
  return (
    <article className="card" aria-label={`Tarjeta ${tarjeta.numeroEnmascarado}`}>
      <header className="card__header">
        <span className="card__marca">
          {tarjeta.marca} · {tarjeta.tipo === "CREDITO" ? "Crédito" : "Débito"}
        </span>
        <Badge estado={tarjeta.estado} />
      </header>
      <p className="card__numero">{tarjeta.numeroEnmascarado}</p>
      <p className="card__titular">{tarjeta.titular}</p>
      <dl className="card__datos">
        <div>
          <dt>Disponible</dt>
          <dd>{formatearMonto(tarjeta.saldoDisponible)}</dd>
        </div>
        <div>
          <dt>Límite</dt>
          <dd>{formatearMonto(tarjeta.limite)}</dd>
        </div>
        <div>
          <dt>Vence</dt>
          <dd>{tarjeta.vencimiento}</dd>
        </div>
      </dl>
      <ProgressBar valor={usado} etiqueta={`Límite utilizado ${usado}%`} />
    </article>
  );
}
