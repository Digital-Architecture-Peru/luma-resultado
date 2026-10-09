import { useEffect, useState } from "react";
import type { PagosApi } from "../services/pagosApi";
import type { FiltroPagos, PagedResult, Pago } from "../types/pago";

export type PagosState =
  | { status: "loading" }
  | { status: "success"; data: PagedResult<Pago> }
  | { status: "error"; message: string };

export function usePagos(api: PagosApi, filtro: FiltroPagos): PagosState {
  const [estado, setEstado] = useState<PagosState>({ status: "loading" });
  const { desde, hasta, estado: estadoPago, page, pageSize } = filtro;

  useEffect(() => {
    const controlador = new AbortController();
    setEstado({ status: "loading" });

    api
      .listar({ desde, hasta, estado: estadoPago, page, pageSize }, controlador.signal)
      .then((data) => {
        if (!controlador.signal.aborted) setEstado({ status: "success", data });
      })
      .catch((error: unknown) => {
        if (controlador.signal.aborted) return;
        const message = error instanceof Error ? error.message : "No se pudo consultar los pagos.";
        setEstado({ status: "error", message });
      });

    return () => controlador.abort();
  }, [api, desde, hasta, estadoPago, page, pageSize]);

  return estado;
}
