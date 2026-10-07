import type { FiltroEstado, Tarjeta } from "../model/tarjeta";

export interface TarjetasApi {
  listar(estado: FiltroEstado): Promise<Tarjeta[]>;
}

type Fetcher = (input: string) => Promise<Response>;

/** Adaptador HTTP hacia el backend Spring Boot. */
export function crearTarjetasApi(fetcher: Fetcher = (url) => fetch(url), baseUrl = "/api/v1"): TarjetasApi {
  return {
    async listar(estado) {
      const query = estado === "TODAS" ? "" : `?estado=${encodeURIComponent(estado)}`;
      const respuesta = await fetcher(`${baseUrl}/tarjetas${query}`);
      if (!respuesta.ok) {
        throw new Error(`No se pudo consultar las tarjetas (HTTP ${respuesta.status})`);
      }
      return (await respuesta.json()) as Tarjeta[];
    },
  };
}
