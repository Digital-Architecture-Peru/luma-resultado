import type { Pago } from "../../types/pago";
import { BadgeEstado } from "../atoms/BadgeEstado";
import { Fecha } from "../atoms/Fecha";
import { Monto } from "../atoms/Monto";

interface DetallePagoProps {
  pago: Pago;
  locale: string;
  onCerrar: () => void;
}

export function DetallePago({ pago, locale, onCerrar }: DetallePagoProps) {
  return (
    <section className="detalle" aria-label="Detalle del pago">
      <h2>Pago {pago.referencia}</h2>
      <dl>
        <dt>Beneficiario</dt>
        <dd>{pago.beneficiario}</dd>
        <dt>Cuenta destino</dt>
        <dd>{pago.cuentaDestino}</dd>
        <dt>Monto</dt>
        <dd>
          <Monto valor={pago.monto} moneda={pago.moneda} locale={locale} />
        </dd>
        <dt>Estado</dt>
        <dd>
          <BadgeEstado estado={pago.estado} />
        </dd>
        <dt>Fecha</dt>
        <dd>
          <Fecha iso={pago.fechaPago} locale={locale} />
        </dd>
      </dl>
      <button type="button" onClick={onCerrar}>
        Cerrar
      </button>
    </section>
  );
}
