import type { Account } from "../../types/account";
import { Amount } from "../atoms/Amount";
import { Badge } from "../atoms/Badge";

interface AccountSummaryProps {
  account: Account;
  selected: boolean;
  onSelect: (id: string) => void;
}

const TYPE_LABELS: Record<string, string> = {
  SAVINGS: "Cuenta de ahorros",
  CHECKING: "Cuenta corriente",
};

export function AccountSummary({ account, selected, onSelect }: AccountSummaryProps) {
  return (
    <button
      type="button"
      className={selected ? "account-card account-card--selected" : "account-card"}
      aria-pressed={selected}
      onClick={() => onSelect(account.id)}
    >
      <span className="account-card__title">{TYPE_LABELS[account.type] ?? account.type}</span>
      <span className="account-card__number">{account.maskedNumber}</span>
      <Amount value={account.balance} currency={account.currency} />
      <Badge status={account.status} />
    </button>
  );
}
