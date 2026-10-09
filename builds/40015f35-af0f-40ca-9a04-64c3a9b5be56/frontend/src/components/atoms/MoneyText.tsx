interface MoneyTextProps {
  amount: string;
  currency: string;
}

export function formatMoney(amount: string, currency: string): string {
  const value = Number(amount);
  if (Number.isNaN(value)) {
    return `${currency} –`;
  }
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `${currency} ${formatted}`;
}

export function MoneyText({ amount, currency }: MoneyTextProps) {
  return <span className="money">{formatMoney(amount, currency)}</span>;
}
