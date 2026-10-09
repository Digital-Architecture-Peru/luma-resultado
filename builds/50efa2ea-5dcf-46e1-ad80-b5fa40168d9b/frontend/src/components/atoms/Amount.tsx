interface AmountProps {
  amount: string;
  currency: string;
}

export function Amount({ amount, currency }: AmountProps) {
  return <span className="amount">{`${amount} ${currency}`}</span>;
}
