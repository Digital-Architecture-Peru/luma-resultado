export type Tono = 'ok' | 'alerta' | 'neutro';

interface BadgeProps {
  texto: string;
  tono: Tono;
}

export function Badge({ texto, tono }: BadgeProps) {
  return <span className={`badge badge--${tono}`}>{texto}</span>;
}
