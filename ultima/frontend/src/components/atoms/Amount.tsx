interface AmountProps {
  value: number;
  currency: string;
}

export default function Amount({ value, currency }: AmountProps) {
  const formatted = new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(value);
  return <span className="amount">{formatted}</span>;
}
