interface Props {
  ultimos4: string;
}

export function PanEnmascarado({ ultimos4 }: Props) {
  return (
    <span className="pan" aria-label={`Tarjeta terminada en ${ultimos4}`}>
      <span aria-hidden="true">•••• {ultimos4}</span>
    </span>
  );
}
