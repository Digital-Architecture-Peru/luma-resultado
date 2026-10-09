import type { Payment } from '../../api/types';
import { formatAmount, formatDate } from '../../utils/format';
import { StatusBadge } from '../atoms/StatusBadge';

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return <p className="empty">No hay pagos para los filtros seleccionados.</p>;
  }
  return (
    <div className="table-wrap">
      <table>
        <caption className="sr-only">Pagos realizados</caption>
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Beneficiario</th>
            <th scope="col">Cuenta</th>
            <th scope="col">Referencia</th>
            <th scope="col" className="num">
              Importe
            </th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{formatDate(p.paidAt)}</td>
              <td>{p.beneficiary}</td>
              <td>{p.accountMasked}</td>
              <td>{p.reference}</td>
              <td className="num">{formatAmount(p.amount, p.currency)}</td>
              <td>
                <StatusBadge status={p.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
