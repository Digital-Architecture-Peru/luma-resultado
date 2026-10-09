import { useEffect, useState } from "react";
import { DetalleTarjeta } from "../components/organisms/DetalleTarjeta";
import { ListaTarjetas } from "../components/organisms/ListaTarjetas";
import { ConsultaLayout } from "../components/templates/ConsultaLayout";
import { tarjetasApi, type TarjetasApi } from "../services/tarjetasApi";
import type { TarjetaDetalle, TarjetaResumen } from "../types/tarjeta";

type Carga<T> =
  | { estado: "cargando" }
  | { estado: "error"; mensaje: string }
  | { estado: "listo"; datos: T };

function mensajeDe(e: unknown): string {
  return e instanceof Error ? e.message : "Ocurrió un error inesperado.";
}

interface Props {
  api?: TarjetasApi;
}

export function TarjetasPage({ api = tarjetasApi }: Props) {
  const [lista, setLista] = useState<Carga<TarjetaResumen[]>>({ estado: "cargando" });
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null);
  const [detalle, setDetalle] = useState<Carga<TarjetaDetalle> | null>(null);

  useEffect(() => {
    let activo = true;
    api
      .listar()
      .then((datos) => activo && setLista({ estado: "listo", datos }))
      .catch((e: unknown) => activo && setLista({ estado: "error", mensaje: mensajeDe(e) }));
    return () => {
      activo = false;
    };
  }, [api]);

  function seleccionar(id: string) {
    setSeleccionadaId(id);
    setDetalle({ estado: "cargando" });
    api
      .detalle(id)
      .then((datos) => setDetalle({ estado: "listo", datos }))
      .catch((e: unknown) => setDetalle({ estado: "error", mensaje: mensajeDe(e) }));
  }

  return (
    <ConsultaLayout titulo="Mis tarjetas">
      {lista.estado === "cargando" && <p role="status">Cargando tarjetas…</p>}
      {lista.estado === "error" && <p role="alert">{lista.mensaje}</p>}
      {lista.estado === "listo" && (
        <ListaTarjetas
          tarjetas={lista.datos}
          seleccionadaId={seleccionadaId}
          onSeleccionar={seleccionar}
        />
      )}
      {detalle?.estado === "cargando" && <p role="status">Cargando detalle…</p>}
      {detalle?.estado === "error" && <p role="alert">{detalle.mensaje}</p>}
      {detalle?.estado === "listo" && <DetalleTarjeta tarjeta={detalle.datos} />}
    </ConsultaLayout>
  );
}
