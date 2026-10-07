import type { EstadoCarga } from "../../hooks/useTarjetas";
import { TarjetaCard } from "../molecules/TarjetaCard";

export function TarjetaLista({ estado }: { estado: EstadoCarga }) {
  if (estado.fase === "cargando") {
    return (
      <p role="status" className="mensaje">
        Cargando tarjetas…
      </p>
    );
  }
  if (estado.fase === "error") {
    return (
      <p role="alert" className="mensaje mensaje--error">
        {estado.mensaje}
      </p>
    );
  }
  if (estado.tarjetas.length === 0) {
    return <p className="mensaje">No hay tarjetas para el filtro seleccionado.</p>;
  }
  return (
    <section className="grid" aria-label="Listado de tarjetas">
      {estado.tarjetas.map((t) => (
        <TarjetaCard key={t.id} tarjeta={t} />
      ))}
    </section>
  );
}
