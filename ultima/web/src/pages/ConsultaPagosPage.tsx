import { useCallback, useMemo, useState } from "react";
import { DetallePago } from "../components/organisms/DetallePago";
import { TablaPagos } from "../components/organisms/TablaPagos";
import { FiltroFechas } from "../components/molecules/FiltroFechas";
import type { FiltroFormulario } from "../components/molecules/FiltroFechas";
import { ConsultaLayout } from "../components/templates/ConsultaLayout";
import { config } from "../config";
import { usePagos } from "../hooks/usePagos";
import { createPagosApi } from "../services/pagosApi";
import type { EstadoPago, Pago } from "../types/pago";

const PAGE_SIZE = 10;

interface FiltroActivo {
  desde?: string;
  hasta?: string;
  estado?: EstadoPago;
  page: number;
}

export function ConsultaPagosPage() {
  const api = useMemo(() => createPagosApi({ baseUrl: config.apiUrl, clienteId: config.clienteId }), []);
  const [filtro, setFiltro] = useState<FiltroActivo>({ page: 1 });
  const [seleccionado, setSeleccionado] = useState<Pago | null>(null);
  const estado = usePagos(api, { ...filtro, pageSize: PAGE_SIZE });

  const consultar = useCallback((formulario: FiltroFormulario) => {
    setSeleccionado(null);
    setFiltro({
      desde: formulario.desde ? `${formulario.desde}T00:00:00Z` : undefined,
      hasta: formulario.hasta ? `${formulario.hasta}T23:59:59Z` : undefined,
      estado: formulario.estado,
      page: 1,
    });
  }, []);

  const cambiarPagina = (delta: number) => setFiltro((actual) => ({ ...actual, page: actual.page + delta }));

  return (
    <ConsultaLayout
      titulo="Consulta de pagos"
      filtros={<FiltroFechas onConsultar={consultar} deshabilitado={estado.status === "loading"} />}
    >
      {estado.status === "loading" && <p role="status">Cargando pagos…</p>}
      {estado.status === "error" && <p role="alert">{estado.message}</p>}
      {estado.status === "success" && (
        <>
          <TablaPagos pagos={estado.data.items} locale={config.locale} onSeleccionar={setSeleccionado} />
          <nav className="paginacion" aria-label="Paginación">
            <button type="button" disabled={filtro.page <= 1} onClick={() => cambiarPagina(-1)}>
              Anterior
            </button>
            <span>
              Página {estado.data.page} · {estado.data.total} pagos
            </span>
            <button
              type="button"
              disabled={estado.data.page * estado.data.pageSize >= estado.data.total}
              onClick={() => cambiarPagina(1)}
            >
              Siguiente
            </button>
          </nav>
        </>
      )}
      {seleccionado && (
        <DetallePago pago={seleccionado} locale={config.locale} onCerrar={() => setSeleccionado(null)} />
      )}
    </ConsultaLayout>
  );
}
