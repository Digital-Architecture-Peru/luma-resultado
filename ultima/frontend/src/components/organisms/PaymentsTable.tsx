import type { Pago } from '../../types/pagos';
import { PaymentRow } from '../molecules/PaymentRow';

interface PaymentsTableProps {
  pagos: Pago[];
}

export function PaymentsTable({ pagos }: PaymentsTableProps) {
  if (pagos.length === 0) {
    return <p className="empty">No se encontraron pagos con los filtros indicados.</p>;
  }
  return (
    <div className="table-wrap">
      <table>
        <caption className="sr-only">Pagos realizados</caption>
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Beneficiario</th>
            <th scope="col">Concepto</th>
            <th scope="col">Cuenta</th>
            <th scope="col" className="num">
              Monto
            </th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago) => (
            <PaymentRow key={pago.id} pago={pago} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
