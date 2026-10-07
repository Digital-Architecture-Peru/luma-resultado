interface MaskedPanProps {
  value: string;
}

export default function MaskedPan({ value }: MaskedPanProps) {
  return (
    <span className="masked-pan" aria-label={`Tarjeta terminada en ${value.slice(-4)}`}>
      {value}
    </span>
  );
}
