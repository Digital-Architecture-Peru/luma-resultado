import { PaymentRow } from '../molecules/PaymentRow';
import type { Payment } from '../../types';

interface PaymentsTableProps {
  payments: Payment[];
  onSelect: (id: string) => void;
}

export function PaymentsTable({ payments, onSelect }: PaymentsTableProps) {
  if (payments.length === 0) {
    return <p className="empty">No hay pagos para los filtros seleccionados.</p>;
  }
  return (
    <div className="table-wrap">
      <table>
        <caption className="sr-only">Pagos del cliente</caption>
        <thead>
          <tr>
            <th scope="col">Referencia</th>
            <th scope="col">Beneficiario</th>
            <th scope="col">Monto</th>
            <th scope="col">Estado</th>
            <th scope="col">Ejecutado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <PaymentRow key={p.id} payment={p} onSelect={onSelect} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
