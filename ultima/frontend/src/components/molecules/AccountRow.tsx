import { TYPE_LABELS, type Account } from "../../domain/account";
import { MoneyText } from "../atoms/MoneyText";
import { StatusBadge } from "../atoms/StatusBadge";

interface AccountRowProps {
  account: Account;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function AccountRow({ account, selected, onSelect }: AccountRowProps) {
  return (
    <li>
      <button
        type="button"
        className={`account-row${selected ? " account-row--selected" : ""}`}
        aria-pressed={selected}
        onClick={() => onSelect(account.id)}
      >
        <span className="account-row__title">
          {TYPE_LABELS[account.type]} {account.maskedNumber}
        </span>
        <StatusBadge status={account.status} />
        <MoneyText amount={account.balance} currency={account.currency} />
      </button>
    </li>
  );
}
