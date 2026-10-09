interface Props {
  valor: string;
  moneda: string;
}

/** Formatea un decimal en texto sin pasar por number (agrupa miles de forma determinista). */
export function formatearMonto(valor: string): string {
  const [entero = "0", decimales] = valor.split(".");
  const signo = entero.startsWith("-") ? "-" : "";
  const digitos = entero.replace("-", "");
  const agrupado = digitos.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${signo}${agrupado}.${(decimales ?? "").padEnd(2, "0").slice(0, 2)}`;
}

export function Monto({ valor, moneda }: Props) {
  return (
    <span className="monto">
      <span className="monto__moneda">{moneda}</span> {formatearMonto(valor)}
    </span>
  );
}
