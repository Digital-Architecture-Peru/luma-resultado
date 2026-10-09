import type { Movement } from '../../domain/types';

interface MovementListProps {
  movements: Movement[];
  currency?: string;
}

const TYPE_LABEL: Record<Movement['type'], string> = {
  DEBIT: 'Débito',
  CREDIT: 'Crédito',
};

export function MovementList({ movements, currency = '' }: MovementListProps) {
  if (movements.length === 0) {
    return <p className="muted">Aún no hay movimientos para mostrar.</p>;
  }
  return (
    <table className="table">
      <caption>Últimos movimientos</caption>
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
        {movements.map((m) => (
          <tr key={m.id}>
            <td>{new Date(m.createdAt).toLocaleString('es')}</td>
            <td>{TYPE_LABEL[m.type]}</td>
            <td className="num">
              {m.type === 'DEBIT' ? '−' : '+'}
              {m.amount} {currency}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
