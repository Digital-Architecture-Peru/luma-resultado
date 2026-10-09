import { formatMoney } from "../../domain/money";
import type { Transaction } from "../../domain/types";

interface TransactionRowProps {
  transaction: Transaction;
  currency: string;
}

export function TransactionRow({ transaction, currency }: TransactionRowProps) {
  const isDebit = transaction.type === "DEBIT";
  return (
    <tr>
      <td>{new Date(transaction.createdAt).toLocaleString("es-EC")}</td>
      <td>{transaction.description ?? "—"}</td>
      <td>
        <span className={`badge badge--${isDebit ? "debit" : "credit"}`}>
          {isDebit ? "Débito" : "Crédito"}
        </span>
      </td>
      <td className="num">
        {isDebit ? "−" : "+"}
        {formatMoney(transaction.amount, currency)}
      </td>
    </tr>
  );
}
