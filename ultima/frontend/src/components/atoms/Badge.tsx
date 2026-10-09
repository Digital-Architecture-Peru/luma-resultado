import type { EstadoPago } from '../../types/pagos';

const ETIQUETAS: Record<EstadoPago, string> = {
  PENDIENTE: 'Pendiente',
  PROCESADO: 'Procesado',
  RECHAZADO: 'Rechazado',
};

interface BadgeProps {
  estado: EstadoPago;
}

/** El estado se comunica con texto, no solo con color. */
export function Badge({ estado }: BadgeProps) {
  return <span className={`badge badge--${estado.toLowerCase()}`}>{ETIQUETAS[estado]}</span>;
}
