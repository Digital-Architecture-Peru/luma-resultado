import type { Account, RemoteState } from "../../types/account";
import { formatDate } from "../../utils/format";
import { Amount } from "../atoms/Amount";
import { Badge } from "../atoms/Badge";
import { StatusMessage } from "../molecules/StatusMessage";

export function AccountDetail({ state }: { state: RemoteState<Account> }) {
  if (state.status === "idle") {
    return <StatusMessage kind="empty" message="Selecciona una cuenta para ver el detalle" />;
  }
  if (state.status === "loading") {
    return <StatusMessage kind="loading" />;
  }
  if (state.status === "error") {
    return <StatusMessage kind="error" message={state.message} />;
  }
  const account = state.data;
  return (
    <section className="account-detail" aria-label="Detalle de cuenta">
      <h2>Cuenta {account.maskedNumber}</h2>
      <dl>
        <dt>Saldo disponible</dt>
        <dd>
          <Amount value={account.balance} currency={account.currency} />
        </dd>
        <dt>Moneda</dt>
        <dd>{account.currency}</dd>
        <dt>Estado</dt>
        <dd>
          <Badge status={account.status} />
        </dd>
        <dt>Fecha de apertura</dt>
        <dd>{formatDate(account.openedAt)}</dd>
      </dl>
    </section>
  );
}
