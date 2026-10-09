import type { Pago } from "../../types/pago";
import { BadgeEstado } from "../atoms/BadgeEstado";
import { Fecha } from "../atoms/Fecha";
import { Monto } from "../atoms/Monto";

interface FilaPagoProps {
  pago: Pago;
  locale: string;
  onSeleccionar: (pago: Pago) => void;
}

export function FilaPago({ pago, locale, onSeleccionar }: FilaPagoProps) {
  return (
    <tr>
      <td>
        <Fecha iso={pago.fechaPago} locale={locale} />
      </td>
      <td>{pago.referencia}</td>
      <td>{pago.beneficiario}</td>
      <td className="num">
        <Monto valor={pago.monto} moneda={pago.moneda} locale={locale} />
      </td>
      <td>
        <BadgeEstado estado={pago.estado} />
      </td>
      <td>
        <button type="button" onClick={() => onSeleccionar(pago)} aria-label={`Ver detalle de ${pago.referencia}`}>
          Ver detalle
        </button>
      </td>
    </tr>
  );
}
