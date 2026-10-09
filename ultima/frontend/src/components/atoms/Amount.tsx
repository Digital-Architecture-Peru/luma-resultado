interface AmountProps {
  value: number;
  currency: string;
}

export function Amount({ value, currency }: AmountProps) {
  // Solo formatea; no hay aritmética de saldos en el front.
  const texto = new Intl.NumberFormat('es-PE', { style: 'currency', currency }).format(value);
  return <span className="amount">{texto}</span>;
}
