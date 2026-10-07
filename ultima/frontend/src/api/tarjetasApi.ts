import type { FiltroEstado, Tarjeta } from '../model';

/** Puerto de consulta; el componente raíz depende de esta abstracción. */
export interface TarjetasApi {
  listar(filtro: FiltroEstado): Promise<Tarjeta[]>;
}

const BASE_URL: string = import.meta.env.VITE_API_BASE ?? '/api/v1';

export const httpTarjetasApi: TarjetasApi = {
  async listar(filtro) {
    const query = filtro === 'TODAS' ? '' : `?estado=${encodeURIComponent(filtro)}`;
    const respuesta = await fetch(`${BASE_URL}/tarjetas${query}`);
    if (!respuesta.ok) {
      throw new Error(`No se pudo consultar las tarjetas (HTTP ${respuesta.status}).`);
    }
    return (await respuesta.json()) as Tarjeta[];
  },
};
