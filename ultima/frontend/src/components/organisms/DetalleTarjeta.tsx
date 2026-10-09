import type { TarjetaDetalle } from "../../types/tarjeta";
import { Badge, varianteDeEstado } from "../atoms/Badge";
import { Monto } from "../atoms/Monto";
import { PanEnmascarado } from "../atoms/PanEnmascarado";

interface Props {
  tarjeta: TarjetaDetalle;
}

export function DetalleTarjeta({ tarjeta }: Props) {
  return (
    <section className="detalle" aria-label="Detalle de tarjeta">
      <h2>
        {tarjeta.marca} <PanEnmascarado ultimos4={tarjeta.ultimos4} />
      </h2>
      <dl>
        <dt>Tipo</dt>
        <dd>{tarjeta.tipo === "CREDITO" ? "Crédito" : "Débito"}</dd>
        <dt>Estado</dt>
        <dd>
          <Badge texto={tarjeta.estado} variante={varianteDeEstado(tarjeta.estado)} />
        </dd>
        <dt>Vencimiento</dt>
        <dd>{tarjeta.vencimiento}</dd>
        <dt>Límite de crédito</dt>
        <dd>
          {tarjeta.limiteCredito === null ? (
            "No aplica"
          ) : (
            <Monto valor={tarjeta.limiteCredito} moneda={tarjeta.moneda} />
          )}
        </dd>
        <dt>Saldo disponible</dt>
        <dd>
          <Monto valor={tarjeta.saldoDisponible} moneda={tarjeta.moneda} />
        </dd>
      </dl>
    </section>
  );
}
