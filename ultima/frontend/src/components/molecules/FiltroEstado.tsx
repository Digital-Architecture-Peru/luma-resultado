import { ESTADOS, type FiltroEstado as Filtro } from "../../model/tarjeta";

interface FiltroEstadoProps {
  valor: Filtro;
  onCambio: (valor: Filtro) => void;
}

export function FiltroEstado({ valor, onCambio }: FiltroEstadoProps) {
  return (
    <div className="filtro">
      <label htmlFor="filtro-estado">Estado</label>
      <select id="filtro-estado" value={valor} onChange={(e) => onCambio(e.target.value as Filtro)}>
        {ESTADOS.map((estado) => (
          <option key={estado} value={estado}>
            {estado === "TODAS" ? "Todas" : estado.charAt(0) + estado.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
