import type { EstadoTarjeta } from "../../model/tarjeta";

const ETIQUETAS: Record<EstadoTarjeta, string> = {
  ACTIVA: "Activa",
  BLOQUEADA: "Bloqueada",
  VENCIDA: "Vencida",
};

export function Badge({ estado }: { estado: EstadoTarjeta }) {
  return <span className={`badge badge--${estado.toLowerCase()}`}>{ETIQUETAS[estado]}</span>;
}
