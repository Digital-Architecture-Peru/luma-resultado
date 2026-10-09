import { StatusMessage } from '../components/atoms/StatusMessage';
import { TransactionForm } from '../components/organisms/TransactionForm';
import { TransactionList } from '../components/organisms/TransactionList';
import { CardLayout } from '../components/templates/CardLayout';
import { useCardTransaction } from '../hooks/useCardTransaction';
import type { TransactionApi } from '../services/api';

interface Props {
  api: TransactionApi;
  cardId: string;
}

export function CardTransactionsPage({ api, cardId }: Props) {
  const { transactions, status, error, submit } = useCardTransaction(api, cardId);
  return (
    <CardLayout title="Transacciones de tarjeta">
      <TransactionForm onSubmit={submit} />
      {error && <StatusMessage kind="error">{error}</StatusMessage>}
      <TransactionList transactions={transactions} status={status} />
    </CardLayout>
  );
}
