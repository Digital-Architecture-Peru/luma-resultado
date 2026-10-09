import { TYPE_LABELS, type Account } from "../../domain/account";
import { MoneyText } from "../atoms/MoneyText";
import { StatusBadge } from "../atoms/StatusBadge";

export function AccountDetail({ account }: { account: Account | null }) {
  if (!account) {
    return <p className="empty">Seleccione una cuenta para ver su detalle.</p>;
  }
  return (
    <section aria-label="Detalle de cuenta" className="detail">
      <h2>
        {TYPE_LABELS[account.type]} {account.maskedNumber}
      </h2>
      <dl>
        <dt>Saldo</dt>
        <dd>
          <MoneyText amount={account.balance} currency={account.currency} />
        </dd>
        <dt>Estado</dt>
        <dd>
          <StatusBadge status={account.status} />
        </dd>
        <dt>Moneda</dt>
        <dd>{account.currency}</dd>
        <dt>Última actualización</dt>
        <dd>{new Date(account.updatedAt).toLocaleString("es-PE")}</dd>
      </dl>
    </section>
  );
}
