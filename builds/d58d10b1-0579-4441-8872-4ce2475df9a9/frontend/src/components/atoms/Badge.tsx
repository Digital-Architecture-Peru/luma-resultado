import type { EstadoTarjeta } from "../../types/tarjeta";

export type VarianteBadge = "ok" | "warn" | "danger" | "neutral";

export function varianteDeEstado(estado: EstadoTarjeta): VarianteBadge {
  switch (estado) {
    case "ACTIVA":
      return "ok";
    case "BLOQUEADA":
      return "warn";
    case "VENCIDA":
      return "danger";
  }
}

interface Props {
  texto: string;
  variante?: VarianteBadge;
}

export function Badge({ texto, variante = "neutral" }: Props) {
  return <span className={`badge badge--${variante}`}>{texto}</span>;
}
