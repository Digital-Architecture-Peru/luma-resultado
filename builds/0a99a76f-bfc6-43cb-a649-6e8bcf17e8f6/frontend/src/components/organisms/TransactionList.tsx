import type { Transaction } from "../../domain/types";
import { TransactionRow } from "../molecules/TransactionRow";

interface TransactionListProps {
  transactions: Transaction[];
  currency: string;
}

export function TransactionList({ transactions, currency }: TransactionListProps) {
  if (transactions.length === 0) {
    return <p className="muted">Sin movimientos todavía.</p>;
  }
  return (
    <table className="table">
      <caption className="sr-only">Últimos movimientos</caption>
      <thead>
        <tr>
          <th scope="col">Fecha</th>
          <th scope="col">Descripción</th>
          <th scope="col">Tipo</th>
          <th scope="col" className="num">
            Monto
          </th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <TransactionRow key={t.id} transaction={t} currency={currency} />
        ))}
      </tbody>
    </table>
  );
}
