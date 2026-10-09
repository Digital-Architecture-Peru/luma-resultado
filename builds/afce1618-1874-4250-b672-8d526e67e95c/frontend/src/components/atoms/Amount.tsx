import { formatMoney } from "../../utils/format";

interface AmountProps {
  value: string;
  currency: string;
}

export function Amount({ value, currency }: AmountProps) {
  const negative = value.trim().startsWith("-");
  return (
    <span className={negative ? "amount amount--negative" : "amount"}>
      {formatMoney(value, currency)}
    </span>
  );
}
