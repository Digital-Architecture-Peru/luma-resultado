interface AmountProps {
  valor: number;
  moneda: string;
}

function formatear(valor: number, moneda: string): string {
  try {
    return new Intl.NumberFormat('es', { style: 'currency', currency: moneda }).format(valor);
  } catch {
    return `${valor.toFixed(2)} ${moneda}`;
  }
}

export function Amount({ valor, moneda }: AmountProps) {
  return <span className="amount">{formatear(valor, moneda)}</span>;
}
