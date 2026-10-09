import type { Pagina, Tarjeta, TarjetasApi } from '../types/tarjeta';

export interface ConfigApi {
  baseUrl: string;
  clienteId: string;
  fetchFn?: typeof fetch;
}

export function crearTarjetasApi(config: ConfigApi): TarjetasApi {
  const llamar = config.fetchFn ?? ((...args: Parameters<typeof fetch>) => fetch(...args));
  return {
    async listar(): Promise<Pagina<Tarjeta>> {
      const respuesta = await llamar(`${config.baseUrl}/api/v1/tarjetas?pagina=0&tamano=20`, {
        headers: { Accept: 'application/json', 'X-Cliente-Id': config.clienteId },
      });
      if (!respuesta.ok) {
        throw new Error(`No se pudo consultar las tarjetas (HTTP ${respuesta.status})`);
      }
      return (await respuesta.json()) as Pagina<Tarjeta>;
    },
  };
}

export function crearTarjetasApiDesdeEntorno(): TarjetasApi {
  return crearTarjetasApi({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
    // UUID ficticio de desarrollo; simula la identidad del cliente.
    clienteId: import.meta.env.VITE_CLIENTE_ID ?? '00000000-0000-4000-8000-000000000001',
  });
}
