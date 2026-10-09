import type { Pago } from "../../types/pago";
import { FilaPago } from "../molecules/FilaPago";

interface TablaPagosProps {
  pagos: Pago[];
  locale: string;
  onSeleccionar: (pago: Pago) => void;
}

export function TablaPagos({ pagos, locale, onSeleccionar }: TablaPagosProps) {
  if (pagos.length === 0) {
    return <p role="status">No hay pagos para los filtros seleccionados.</p>;
  }

  return (
    <table className="tabla">
      <caption>Pagos realizados</caption>
      <thead>
        <tr>
          <th scope="col">Fecha</th>
          <th scope="col">Referencia</th>
          <th scope="col">Beneficiario</th>
          <th scope="col" className="num">
            Monto
          </th>
          <th scope="col">Estado</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {pagos.map((pago) => (
          <FilaPago key={pago.id} pago={pago} locale={locale} onSeleccionar={onSeleccionar} />
        ))}
      </tbody>
    </table>
  );
}
