interface ProgressBarProps {
  valor: number;
  etiqueta: string;
}

export function ProgressBar({ valor, etiqueta }: ProgressBarProps) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={etiqueta}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={valor}
    >
      <div className="progress__fill" style={{ inlineSize: `${valor}%` }} />
    </div>
  );
}
