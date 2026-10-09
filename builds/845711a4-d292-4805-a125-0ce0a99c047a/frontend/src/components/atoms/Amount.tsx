import { formatAmount } from "../../utils/format";

interface AmountProps {
  value: number;
  currency: string;
}

export function Amount({ value, currency }: AmountProps) {
  return <span className="amount">{formatAmount(value, currency)}</span>;
}
