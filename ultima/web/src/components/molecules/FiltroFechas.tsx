import { useState } from "react";
import type { FormEvent } from "react";
import { ESTADOS_PAGO } from "../../types/pago";
import type { EstadoPago } from "../../types/pago";

export interface FiltroFormulario {
  desde?: string;
  hasta?: string;
  estado?: EstadoPago;
}

interface FiltroFechasProps {
  onConsultar: (filtro: FiltroFormulario) => void;
  deshabilitado?: boolean;
}

export function FiltroFechas({ onConsultar, deshabilitado = false }: FiltroFechasProps) {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [estado, setEstado] = useState("");

  const rangoInvalido = desde !== "" && hasta !== "" && desde > hasta;

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (rangoInvalido) return;
    onConsultar({
      desde: desde || undefined,
      hasta: hasta || undefined,
      estado: (estado || undefined) as EstadoPago | undefined,
    });
  }

  return (
    <form className="filtros" onSubmit={enviar}>
      <label>
        Desde
        <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
      </label>
      <label>
        Hasta
        <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
      </label>
      <label>
        Estado
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos</option>
          {ESTADOS_PAGO.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </label>
      {rangoInvalido && <p role="alert">La fecha inicial no puede ser posterior a la final.</p>}
      <button type="submit" disabled={deshabilitado || rangoInvalido}>
        Consultar
      </button>
    </form>
  );
}
