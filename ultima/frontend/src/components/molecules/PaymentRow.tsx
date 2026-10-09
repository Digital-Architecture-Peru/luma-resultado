import type { Pago } from '../../types/pagos';
import { Amount } from '../atoms/Amount';
import { Badge } from '../atoms/Badge';

interface PaymentRowProps {
  pago: Pago;
}

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es', { dateStyle: 'medium', timeZone: 'UTC' });
}

export function PaymentRow({ pago }: PaymentRowProps) {
  return (
    <tr>
      <td>{formatearFecha(pago.fechaPago)}</td>
      <td>{pago.beneficiario}</td>
      <td>{pago.concepto}</td>
      <td>{pago.cuenta}</td>
      <td className="num">
        <Amount valor={pago.monto} moneda={pago.moneda} />
      </td>
      <td>
        <Badge estado={pago.estado} />
      </td>
    </tr>
  );
}
