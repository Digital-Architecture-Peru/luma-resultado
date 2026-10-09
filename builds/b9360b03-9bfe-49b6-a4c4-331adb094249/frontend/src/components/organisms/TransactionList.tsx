import type { Transaction } from '../../domain/types';
import { StatusBadge } from '../atoms/StatusBadge';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
}

export function TransactionList({ transactions, loading }: TransactionListProps) {
  if (loading) {
    return <p className="muted">Cargando movimientos…</p>;
  }
  if (transactions.length === 0) {
    return <p className="muted">Aún no hay movimientos para esta tarjeta.</p>;
  }

  return (
    <table className="card table">
      <caption>Últimos movimientos</caption>
      <thead>
        <tr>
          <th scope="col">Fecha</th>
          <th scope="col" className="num">
            Importe
          </th>
          <th scope="col">Estado</th>
          <th scope="col">Detalle</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <tr key={tx.id}>
            <td>{new Date(tx.createdAt).toLocaleString('es')}</td>
            <td className="num">
              {tx.amount.toFixed(2)} {tx.currency}
            </td>
            <td>
              <StatusBadge status={tx.status} />
            </td>
            <td>{tx.rejectionReason ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
