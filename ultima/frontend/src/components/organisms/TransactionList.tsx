import { formatDate, formatMoney } from '../../domain/amount';
import type { Transaction } from '../../types';
import { Badge } from '../atoms/Badge';

interface TransactionListProps {
  transactions: Transaction[];
}

/** Organismo: tabla de movimientos de la tarjeta. */
export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return <p className="muted">Esta tarjeta aún no tiene movimientos.</p>;
  }
  return (
    <table className="table">
      <caption className="sr-only">Movimientos de la tarjeta</caption>
      <thead>
        <tr>
          <th scope="col">Fecha</th>
          <th scope="col">Tipo</th>
          <th scope="col" className="num">
            Monto
          </th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t.id}>
            <td>{formatDate(t.createdAt)}</td>
            <td>
              <Badge tone={t.type === 'PAYMENT' ? 'success' : 'neutral'}>
                {t.type === 'PAYMENT' ? 'Pago' : 'Compra'}
              </Badge>
            </td>
            <td className="num">{formatMoney(t.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
