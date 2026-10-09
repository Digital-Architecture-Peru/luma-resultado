import type { Account } from "../../domain/account";
import { AccountRow } from "../molecules/AccountRow";

interface AccountListProps {
  accounts: Account[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function AccountList({ accounts, selectedId, onSelect }: AccountListProps) {
  if (accounts.length === 0) {
    return <p className="empty">No hay cuentas para mostrar.</p>;
  }
  return (
    <ul className="account-list" aria-label="Listado de cuentas">
      {accounts.map((account) => (
        <AccountRow
          key={account.id}
          account={account}
          selected={account.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
