import { useState, useMemo } from 'react';

type EstadoCapacidad = 'Activa' | 'En revisión' | 'Suspendida';

interface CapacidadPago {
  id: string;
  nombre: string;
  proveedor: string;
  metodo: string;
  limiteDiario: number;
  moneda: string;
  estado: EstadoCapacidad;
}

const CAPACIDADES_INICIALES: CapacidadPago[] = [
  { id: 'cap-001', nombre: 'Pago con tarjeta', proveedor: 'VisaNet', metodo: 'Tarjeta crédito/débito', limiteDiario: 15000, moneda: 'PEN', estado: 'Activa' },
  { id: 'cap-002', nombre: 'Transferencia interbancaria', proveedor: 'CCE', metodo: 'Transferencia', limiteDiario: 50000, moneda: 'PEN', estado: 'Activa' },
  { id: 'cap-003', nombre: 'Billetera digital', proveedor: 'Yape', metodo: 'Wallet', limiteDiario: 3000, moneda: 'PEN', estado: 'En revisión' },
  { id: 'cap-004', nombre: 'Pago QR comercio', proveedor: 'Izipay', metodo: 'QR', limiteDiario: 8000, moneda: 'PEN', estado: 'Activa' },
  { id: 'cap-005', nombre: 'Débito automático', proveedor: 'BancoNet', metodo: 'Débito programado', limiteDiario: 20000, moneda: 'PEN', estado: 'Suspendida' },
];

function formatearMonto(valor: number, moneda: string): string {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: moneda }).format(valor);
}

export default function App() {
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<'Todos' | EstadoCapacidad>('Todos');
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(CAPACIDADES_INICIALES[0]?.id ?? null);
  const [resultadoPrueba, setResultadoPrueba] = useState<string | null>(null);
  const [probando, setProbando] = useState(false);

  const capacidadesFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return CAPACIDADES_INICIALES.filter((c) => {
      const coincideTexto =
        texto.length === 0 ||
        c.nombre.toLowerCase().includes(texto) ||
        c.proveedor.toLowerCase().includes(texto) ||
        c.metodo.toLowerCase().includes(texto);
      const coincideEstado = estadoFiltro === 'Todos' || c.estado === estadoFiltro;
      return coincideTexto && coincideEstado;
    });
  }, [busqueda, estadoFiltro]);

  const seleccionada = useMemo(
    () => CAPACIDADES_INICIALES.find((c) => c.id === seleccionadaId) ?? null,
    [seleccionadaId]
  );

  function handleProbarCapacidad() {
    setProbando(true);
    const marca = new Date().toLocaleTimeString('es-PE');
    const base = seleccionada
      ? `Capacidad simulada para "${seleccionada.nombre}" (${seleccionada.proveedor}) a las ${marca}. Latencia estimada 180ms, estado de respuesta: aprobado ficticio.`
      : `Capacidad simulada a las ${marca}. Latencia estimada 180ms, estado de respuesta: aprobado ficticio.`;
    setResultadoPrueba(base);
    setProbando(false);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>Consulta de capacidades de pago</h1>
          <p className="app-subtitle">
            App móvil · Dominio Pagos · Datos ficticios en memoria, se reinician al recargar.
          </p>
        </div>
      </header>

      <section className="toolbar" aria-label="Filtros de búsqueda">
        <div className="field">
          <label htmlFor="busqueda-capacidad">Buscar capacidad</label>
          <input
            id="busqueda-capacidad"
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Nombre, proveedor o método"
          />
        </div>
        <div className="field">
          <label htmlFor="filtro-estado">Estado</label>
          <select
            id="filtro-estado"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value as 'Todos' | EstadoCapacidad)}
          >
            <option value="Todos">Todos</option>
            <option value="Activa">Activa</option>
            <option value="En revisión">En revisión</option>
            <option value="Suspendida">Suspendida</option>
          </select>
        </div>
      </section>

      <section className="content-grid">
        <div className="table-container" role="region" aria-label="Listado de capacidades de pago">
          <table>
            <thead>
              <tr>
                <th scope="col">Capacidad</th>
                <th scope="col">Proveedor</th>
                <th scope="col">Límite diario</th>
                <th scope="col">Estado</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {capacidadesFiltradas.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-state">
                    No se encontraron capacidades con los filtros aplicados.
                  </td>
                </tr>
              )}
              {capacidadesFiltradas.map((c) => (
                <tr key={c.id} className={c.id === seleccionadaId ? 'row-selected' : undefined}>
                  <td data-label="Capacidad">
                    <span className="cell-title">{c.nombre}</span>
                    <span className="cell-sub">{c.metodo}</span>
                  </td>
                  <td data-label="Proveedor">{c.proveedor}</td>
                  <td data-label="Límite diario">{formatearMonto(c.limiteDiario, c.moneda)}</td>
                  <td data-label="Estado">
                    <span className={`badge badge-${c.estado.replace(' ', '-').toLowerCase()}`}>{c.estado}</span>
                  </td>
                  <td data-label="Acción">
                    <button
                      type="button"
                      className="btn-secondary"
                      aria-pressed={c.id === seleccionadaId}
                      onClick={() => setSeleccionadaId(c.id)}
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="detail-panel" aria-label="Detalle y prueba de capacidad">
          <h2>Detalle de capacidad</h2>
          {seleccionada ? (
            <dl className="detail-list">
              <div>
                <dt>Nombre</dt>
                <dd>{seleccionada.nombre}</dd>
              </div>
              <div>
                <dt>Proveedor</dt>
                <dd>{seleccionada.proveedor}</dd>
              </div>
              <div>
                <dt>Método</dt>
                <dd>{seleccionada.metodo}</dd>
              </div>
              <div>
                <dt>Límite diario</dt>
                <dd>{formatearMonto(seleccionada.limiteDiario, seleccionada.moneda)}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{seleccionada.estado}</dd>
              </div>
            </dl>
          ) : (
            <p className="empty-state">Selecciona una capacidad en la tabla para ver su detalle.</p>
          )}

          <button
            type="button"
            className="btn-primary"
            onClick={handleProbarCapacidad}
            disabled={probando}
          >
            Probar capacidad
          </button>

          <div className="result-area" role="status" aria-live="polite">
            {resultadoPrueba && (
              <p>
                <strong>Capacidad simulada.</strong> {resultadoPrueba}
              </p>
            )}
          </div>
        </aside>
      </section>

      <footer className="app-footer">
        <p>
          Microapp de referencia (create, local-bounded). Datos y simulaciones ficticias, sin integración ni
          persistencia real.
        </p>
      </footer>
    </main>
  );
}
