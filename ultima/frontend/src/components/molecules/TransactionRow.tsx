import type { CardTransaction } from '../../services/api';

const TYPE_LABEL: Record<CardTransaction['type'], string> = {
  PURCHASE: 'Compra',
  PAYMENT: 'Pago',
  REFUND: 'Reembolso',
};

export function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('es', { style: 'currency', currency }).format(amount);
}

export function TransactionRow({ tx }: { tx: CardTransaction }) {
  return (
    <tr>
      <td>{new Date(tx.createdAt).toLocaleDateString('es')}</td>
      <td>{TYPE_LABEL[tx.type]}</td>
      <td>{tx.description ?? '—'}</td>
      <td className="num">{formatAmount(tx.amount, tx.currency)}</td>
      <td>{tx.status === 'APPROVED' ? 'Aprobada' : 'Rechazada'}</td>
    </tr>
  );
}
