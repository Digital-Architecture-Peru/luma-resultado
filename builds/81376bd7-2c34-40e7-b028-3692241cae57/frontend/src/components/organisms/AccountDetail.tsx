import type { Cuenta } from '../../types/cuenta';
import { Amount } from '../atoms/Amount';
import { Badge } from '../atoms/Badge';

interface AccountDetailProps {
  cuenta: Cuenta;
  onClose: () => void;
}

export function AccountDetail({ cuenta, onClose }: AccountDetailProps) {
  const activa = cuenta.estado === 'ACTIVA';
  return (
    <section className="account-detail" aria-label="Detalle de cuenta">
      <h2>Cuenta {cuenta.numeroEnmascarado}</h2>
      <dl>
        <dt>Tipo</dt>
        <dd>{cuenta.tipo === 'AHORROS' ? 'Ahorros' : 'Corriente'}</dd>
        <dt>Saldo</dt>
        <dd>
          <Amount value={cuenta.saldo} currency={cuenta.moneda} />
        </dd>
        <dt>Estado</dt>
        <dd>
          <Badge tone={activa ? 'ok' : 'warn'} label={activa ? 'Activa' : 'Bloqueada'} />
        </dd>
        <dt>Actualizado</dt>
        <dd>{new Date(cuenta.actualizadoEn).toLocaleString('es-PE')}</dd>
      </dl>
      <button type="button" onClick={onClose}>
        Cerrar detalle
      </button>
    </section>
  );
}
