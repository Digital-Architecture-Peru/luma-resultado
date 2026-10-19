import type { Pago } from '../../api/pagosClient';
import { ETIQUETA_ESTADO, formatearFecha, formatearMonto } from './formato';

interface Props {
  pago: Pago;
  onCerrar: () => void;
}

export function PagoDetalle({ pago, onCerrar }: Props) {
  return (
    <section className="detalle" aria-labelledby="detalle-titulo">
      <h2 id="detalle-titulo">Detalle del pago {pago.referencia}</h2>
      <dl>
        <dt>Beneficiario</dt>
        <dd>{pago.beneficiario}</dd>
        <dt>Cuenta destino</dt>
        <dd>{pago.cuentaDestinoMask}</dd>
        <dt>Monto</dt>
        <dd>{formatearMonto(pago.monto, pago.moneda)}</dd>
        <dt>Estado</dt>
        <dd>{ETIQUETA_ESTADO[pago.estado]}</dd>
        <dt>Fecha</dt>
        <dd>{formatearFecha(pago.fechaPago)}</dd>
        <dt>Canal</dt>
        <dd>{pago.canal}</dd>
      </dl>
      <button type="button" onClick={onCerrar}>
        Cerrar detalle
      </button>
    </section>
  );
}
