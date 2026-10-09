import type { Account } from "../../types/account";
import { AccountSummary } from "../molecules/AccountSummary";
import { StatusMessage } from "../molecules/StatusMessage";

interface AccountListProps {
  accounts: Account[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function AccountList({ accounts, selectedId, onSelect }: AccountListProps) {
  if (accounts.length === 0) {
    return <StatusMessage kind="empty" message="No tienes cuentas registradas" />;
  }
  return (
    <ul className="account-list" aria-label="Mis cuentas">
      {accounts.map((account) => (
        <li key={account.id}>
          <AccountSummary
            account={account}
            selected={account.id === selectedId}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}
