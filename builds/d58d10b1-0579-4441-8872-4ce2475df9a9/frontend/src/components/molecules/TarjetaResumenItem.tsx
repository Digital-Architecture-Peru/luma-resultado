import type { TarjetaResumen } from "../../types/tarjeta";
import { Badge, varianteDeEstado } from "../atoms/Badge";
import { Monto } from "../atoms/Monto";
import { PanEnmascarado } from "../atoms/PanEnmascarado";

interface Props {
  tarjeta: TarjetaResumen;
  seleccionada: boolean;
  onSeleccionar: (id: string) => void;
}

export function TarjetaResumenItem({ tarjeta, seleccionada, onSeleccionar }: Props) {
  return (
    <button
      type="button"
      className={`tarjeta-item${seleccionada ? " tarjeta-item--activa" : ""}`}
      aria-pressed={seleccionada}
      onClick={() => onSeleccionar(tarjeta.id)}
    >
      <span className="tarjeta-item__marca">
        {tarjeta.marca} · {tarjeta.tipo === "CREDITO" ? "Crédito" : "Débito"}
      </span>
      <PanEnmascarado ultimos4={tarjeta.ultimos4} />
      <Badge texto={tarjeta.estado} variante={varianteDeEstado(tarjeta.estado)} />
      <Monto valor={tarjeta.saldoDisponible} moneda={tarjeta.moneda} />
    </button>
  );
}
