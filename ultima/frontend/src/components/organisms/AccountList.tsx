import type { Account } from "../../domain/types";
import { AccountCard } from "../molecules/AccountCard";

interface AccountListProps {
  accounts: Account[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function AccountList({ accounts, selectedId, onSelect }: AccountListProps) {
  if (accounts.length === 0) {
    return <p className="muted">No hay cuentas disponibles.</p>;
  }
  return (
    <ul className="card-list" aria-label="Mis cuentas">
      {accounts.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          selected={account.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
