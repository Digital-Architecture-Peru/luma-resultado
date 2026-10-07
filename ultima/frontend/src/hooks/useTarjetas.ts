import { useEffect, useState } from "react";
import type { FiltroEstado, Tarjeta } from "../model/tarjeta";
import type { TarjetasApi } from "../services/tarjetasApi";

export type EstadoCarga =
  | { fase: "cargando" }
  | { fase: "exito"; tarjetas: Tarjeta[] }
  | { fase: "error"; mensaje: string };

export function useTarjetas(api: TarjetasApi, filtro: FiltroEstado): EstadoCarga {
  const [estado, setEstado] = useState<EstadoCarga>({ fase: "cargando" });

  useEffect(() => {
    let vigente = true;
    setEstado({ fase: "cargando" });
    api
      .listar(filtro)
      .then((tarjetas) => {
        if (vigente) setEstado({ fase: "exito", tarjetas });
      })
      .catch((error: unknown) => {
        if (vigente) {
          setEstado({
            fase: "error",
            mensaje: error instanceof Error ? error.message : "Error desconocido",
          });
        }
      });
    return () => {
      vigente = false;
    };
  }, [api, filtro]);

  return estado;
}
