import type { CardTransaction } from '../../services/api';
import type { RemoteStatus } from '../../hooks/useCardTransaction';
import { StatusMessage } from '../atoms/StatusMessage';
import { TransactionRow } from '../molecules/TransactionRow';

interface Props {
  transactions: CardTransaction[];
  status: RemoteStatus;
}

export function TransactionList({ transactions, status }: Props) {
  if (status === 'loading' && transactions.length === 0) {
    return <StatusMessage kind="info">Cargando movimientos…</StatusMessage>;
  }
  if (transactions.length === 0) {
    return <StatusMessage kind="info">Aún no hay movimientos.</StatusMessage>;
  }
  return (
    <table>
      <caption>Últimos movimientos</caption>
      <thead>
        <tr>
          <th scope="col">Fecha</th>
          <th scope="col">Tipo</th>
          <th scope="col">Descripción</th>
          <th scope="col" className="num">Monto</th>
          <th scope="col">Estado</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <TransactionRow key={tx.id} tx={tx} />
        ))}
      </tbody>
    </table>
  );
}
