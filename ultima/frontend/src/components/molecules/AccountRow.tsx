import type { Cuenta } from '../../types/cuenta';
import { Amount } from '../atoms/Amount';
import { Badge } from '../atoms/Badge';

interface AccountRowProps {
  cuenta: Cuenta;
  onSelect: (id: string) => void;
}

export function AccountRow({ cuenta, onSelect }: AccountRowProps) {
  const activa = cuenta.estado === 'ACTIVA';
  return (
    <li className="account-row">
      <button type="button" onClick={() => onSelect(cuenta.id)}>
        <span className="account-row__tipo">{cuenta.tipo === 'AHORROS' ? 'Ahorros' : 'Corriente'}</span>
        <span className="account-row__numero">{cuenta.numeroEnmascarado}</span>
        <Amount value={cuenta.saldo} currency={cuenta.moneda} />
        <Badge tone={activa ? 'ok' : 'warn'} label={activa ? 'Activa' : 'Bloqueada'} />
      </button>
    </li>
  );
}
