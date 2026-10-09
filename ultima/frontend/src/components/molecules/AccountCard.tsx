import { formatMoney } from "../../domain/money";
import type { Account } from "../../domain/types";
import { Button } from "../atoms/Button";

interface AccountCardProps {
  account: Account;
  selected: boolean;
  onSelect: (id: number) => void;
}

export function AccountCard({ account, selected, onSelect }: AccountCardProps) {
  return (
    <li className={`card${selected ? " card--selected" : ""}`}>
      <div>
        <p className="card__title">Cuenta {account.number}</p>
        <p className="muted">{account.holder}</p>
        <p className="amount">{formatMoney(account.balance, account.currency)}</p>
      </div>
      <Button
        variant="secondary"
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(account.id)}
      >
        Ver movimientos
      </Button>
    </li>
  );
}
