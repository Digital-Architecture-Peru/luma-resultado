import type { Pago } from '../../api/pagosClient';
import { ETIQUETA_ESTADO, formatearFecha, formatearMonto } from './formato';

interface Props {
  pagos: Pago[];
  onSeleccionar: (pago: Pago) => void;
}

export function PagosList({ pagos, onSeleccionar }: Props) {
  if (pagos.length === 0) {
    return <p role="status">No se encontraron pagos para los filtros indicados.</p>;
  }
  return (
    <table>
      <caption className="solo-lectores">Listado de pagos</caption>
      <thead>
        <tr>
          <th scope="col">Fecha</th>
          <th scope="col">Referencia</th>
          <th scope="col">Beneficiario</th>
          <th scope="col" className="num">
            Monto
          </th>
          <th scope="col">Estado</th>
          <th scope="col">Detalle</th>
        </tr>
      </thead>
      <tbody>
        {pagos.map((p) => (
          <tr key={p.id}>
            <td>{formatearFecha(p.fechaPago)}</td>
            <td>{p.referencia}</td>
            <td>{p.beneficiario}</td>
            <td className="num">{formatearMonto(p.monto, p.moneda)}</td>
            <td>
              <span className={`badge badge-${p.estado.toLowerCase()}`}>{ETIQUETA_ESTADO[p.estado]}</span>
            </td>
            <td>
              <button type="button" onClick={() => onSeleccionar(p)} aria-label={`Ver detalle de ${p.referencia}`}>
                Ver
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
