import { formatMonto } from "../../utils/format";

interface MontoProps {
  valor: number;
  moneda: string;
  locale: string;
}

export function Monto({ valor, moneda, locale }: MontoProps) {
  return <span className="monto">{formatMonto(valor, moneda, locale)}</span>;
}
