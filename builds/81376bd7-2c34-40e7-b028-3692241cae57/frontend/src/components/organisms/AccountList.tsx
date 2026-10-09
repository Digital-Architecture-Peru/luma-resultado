import type { Cuenta } from '../../types/cuenta';
import { AccountRow } from '../molecules/AccountRow';
import { ErrorMessage } from '../molecules/ErrorMessage';
import { Spinner } from '../atoms/Spinner';

interface AccountListProps {
  cuentas: Cuenta[];
  loading: boolean;
  error: string | null;
  onSelect: (id: string) => void;
}

export function AccountList({ cuentas, loading, error, onSelect }: AccountListProps) {
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (cuentas.length === 0) return <p className="empty">No tiene cuentas registradas.</p>;
  return (
    <ul className="account-list" aria-label="Mis cuentas">
      {cuentas.map((c) => (
        <AccountRow key={c.id} cuenta={c} onSelect={onSelect} />
      ))}
    </ul>
  );
}
