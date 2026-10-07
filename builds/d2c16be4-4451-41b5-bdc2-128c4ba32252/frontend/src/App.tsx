import { useState } from "react";
import { FiltroEstado } from "./components/molecules/FiltroEstado";
import { TarjetaLista } from "./components/organisms/TarjetaLista";
import { useTarjetas } from "./hooks/useTarjetas";
import type { FiltroEstado as Filtro } from "./model/tarjeta";
import { crearTarjetasApi, type TarjetasApi } from "./services/tarjetasApi";

const apiPorDefecto = crearTarjetasApi();

export function App({ api = apiPorDefecto }: { api?: TarjetasApi }) {
  const [filtro, setFiltro] = useState<Filtro>("TODAS");
  const estado = useTarjetas(api, filtro);

  return (
    <main className="page">
      <h1>Mis tarjetas</h1>
      <FiltroEstado valor={filtro} onCambio={setFiltro} />
      <TarjetaLista estado={estado} />
    </main>
  );
}
