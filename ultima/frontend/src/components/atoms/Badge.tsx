import type { EstadoTarjeta } from '../../model';

const ETIQUETAS: Record<EstadoTarjeta, string> = {
  ACTIVA: 'Activa',
  BLOQUEADA: 'Bloqueada',
  VENCIDA: 'Vencida',
};

interface BadgeProps {
  estado: EstadoTarjeta;
}

export function Badge({ estado }: BadgeProps) {
  return <span className={`badge badge--${estado.toLowerCase()}`}>{ETIQUETAS[estado]}</span>;
}
