import type { EstadoPago } from "../../types/pago";

const ETIQUETAS: Record<EstadoPago, string> = {
  PENDIENTE: "Pendiente",
  PROCESADO: "Procesado",
  RECHAZADO: "Rechazado",
  REVERSADO: "Reversado",
};

export function BadgeEstado({ estado }: { estado: EstadoPago }) {
  return <span className={`badge badge--${estado.toLowerCase()}`}>{ETIQUETAS[estado]}</span>;
}
