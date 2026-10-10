interface AmountTextProps {
  amount: number;
  currency: string;
}

const LOCALE = 'en-US';

export function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat(LOCALE, { style: 'currency', currency }).format(amount);
}

export function AmountText({ amount, currency }: AmountTextProps) {
  return <span className="amount">{formatAmount(amount, currency)}</span>;
}
