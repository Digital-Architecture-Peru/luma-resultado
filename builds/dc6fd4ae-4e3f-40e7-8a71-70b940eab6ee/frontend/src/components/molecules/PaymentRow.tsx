import { StatusBadge } from '../atoms/StatusBadge';
import { Button } from '../atoms/Button';
import { formatAmount, formatDate } from '../../services/format';
import type { Payment } from '../../types';

interface PaymentRowProps {
  payment: Payment;
  onSelect: (id: string) => void;
}

export function PaymentRow({ payment, onSelect }: PaymentRowProps) {
  return (
    <tr>
      <td>{payment.reference}</td>
      <td>{payment.beneficiaryName}</td>
      <td className="num">{formatAmount(payment.amount, payment.currency)}</td>
      <td>
        <StatusBadge status={payment.status} />
      </td>
      <td>{formatDate(payment.executedAt)}</td>
      <td>
        <Button
          variant="secondary"
          aria-label={`Ver detalle de ${payment.reference}`}
          onClick={() => onSelect(payment.id)}
        >
          Ver detalle
        </Button>
      </td>
    </tr>
  );
}
