import { useMemo, useState } from 'react';

type EstadoTarjeta = 'Activa' | 'Bloqueada' | 'Vencida';

interface Tarjeta {
  id: string;
  titular: string;
  numeroMasked: string;
  tipo: 'Débito' | 'Crédito';
  estado: EstadoTarjeta;
  saldo: number;
  limite: number;
}

const TARJETAS_INICIALES: Tarjeta[] = [
  { id: 'c1', titular: 'Ana María Torres', numeroMasked: '**** **** **** 4821', tipo: 'Débito', estado: 'Activa', saldo: 3250.75, limite: 5000 },
  { id: 'c2', titular: 'Luis Fernando Gómez', numeroMasked: '**** **** **** 1190', tipo: 'Crédito', estado: 'Activa', saldo: 1820.4, limite: 8000 },
  { id: 'c3', titular: 'Carla Ibarra Soto', numeroMasked: '**** **** **** 7734', tipo: 'Crédito', estado: 'Bloqueada', saldo: 0, limite: 6000 },
  { id: 'c4', titular: 'Miguel Ángel Rojas', numeroMasked: '**** **** **** 5502', tipo: 'Débito', estado: 'Vencida', saldo: 540.1, limite: 2000 },
  { id: 'c5', titular: 'Patricia Elena Vidal', numeroMasked: '**** **** **** 3309', tipo: 'Crédito', estado: 'Activa', saldo: 4120.0, limite: 10000 },
];

function formatoMoneda(valor: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(valor);
}

export default function App() {
  const [tarjetas] = useState<Tarjeta[]>(TARJETAS_INICIALES);
  const [termino, setTermino] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<'Todos' | EstadoTarjeta>('Todos');
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null);
  const [mensajeCapacidad, setMensajeCapacidad] = useState('');

  const tarjetasFiltradas = useMemo(() => {
    const texto = termino.trim().toLowerCase();
    return tarjetas.filter((t) => {
      const coincideTexto =
        texto === '' ||
        t.titular.toLowerCase().includes(texto) ||
        t.numeroMasked.toLowerCase().includes(texto);
      const coincideEstado = estadoFiltro === 'Todos' || t.estado === estadoFiltro;
      return coincideTexto && coincideEstado;
    });
  }, [tarjetas, termino, estadoFiltro]);

  const tarjetaSeleccionada = useMemo(
    () => tarjetas.find((t) => t.id === seleccionadaId) ?? null,
    [tarjetas, seleccionadaId]
  );

  function manejarProbarCapacidad() {
    setMensajeCapacidad('Consulta de Tarjetas');
  }

  function limpiarBusqueda() {
    setTermino('');
    setEstadoFiltro('Todos');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">Banca por Internet</p>
          <h1>Consulta de Tarjetas</h1>
          <p className="app-subtitle">
            Revisa el estado, saldo y límite de las tarjetas asociadas en un entorno de datos
            ficticios.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={manejarProbarCapacidad}
        >
          Probar capacidad
        </button>
      </header>

      <p role="status" aria-live="polite" className="status-banner">
        {mensajeCapacidad}
      </p>

      <section className="panel" aria-labelledby="busqueda-titulo">
        <h2 id="busqueda-titulo" className="panel-title">
          Buscar tarjetas
        </h2>
        <div className="filtros">
          <div className="campo">
            <label htmlFor="busqueda-input">Titular o número</label>
            <input
              id="busqueda-input"
              type="search"
              placeholder="Ej. Ana Torres o 4821"
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="estado-select">Estado</label>
            <select
              id="estado-select"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value as 'Todos' | EstadoTarjeta)}
            >
              <option value="Todos">Todos</option>
              <option value="Activa">Activa</option>
              <option value="Bloqueada">Bloqueada</option>
              <option value="Vencida">Vencida</option>
            </select>
          </div>
          <button type="button" className="btn btn-secondary" onClick={limpiarBusqueda}>
            Limpiar filtros
          </button>
        </div>
      </section>

      <section className="panel" aria-labelledby="resultados-titulo">
        <h2 id="resultados-titulo" className="panel-title">
          Resultados ({tarjetasFiltradas.length})
        </h2>
        {tarjetasFiltradas.length === 0 ? (
          <p className="estado-vacio">No se encontraron tarjetas con los criterios indicados.</p>
        ) : (
          <div className="tabla-wrapper">
            <table className="tabla-tarjetas">
              <thead>
                <tr>
                  <th scope="col">Titular</th>
                  <th scope="col">Número</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className="col-num">
                    Saldo
                  </th>
                  <th scope="col">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {tarjetasFiltradas.map((t) => (
                  <tr key={t.id} className={t.id === seleccionadaId ? 'fila-activa' : ''}>
                    <td>{t.titular}</td>
                    <td>{t.numeroMasked}</td>
                    <td>{t.tipo}</td>
                    <td>
                      <span className={`badge badge-${t.estado.toLowerCase()}`}>{t.estado}</span>
                    </td>
                    <td className="col-num">{formatoMoneda(t.saldo)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        aria-pressed={t.id === seleccionadaId}
                        onClick={() => setSeleccionadaId(t.id)}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {tarjetaSeleccionada && (
        <section className="panel detalle" aria-labelledby="detalle-titulo">
          <h2 id="detalle-titulo" className="panel-title">
            Detalle de {tarjetaSeleccionada.titular}
          </h2>
          <dl className="detalle-grid">
            <div>
              <dt>Número</dt>
              <dd>{tarjetaSeleccionada.numeroMasked}</dd>
            </div>
            <div>
              <dt>Tipo</dt>
              <dd>{tarjetaSeleccionada.tipo}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{tarjetaSeleccionada.estado}</dd>
            </div>
            <div>
              <dt>Saldo actual</dt>
              <dd>{formatoMoneda(tarjetaSeleccionada.saldo)}</dd>
            </div>
            <div>
              <dt>Límite</dt>
              <dd>{formatoMoneda(tarjetaSeleccionada.limite)}</dd>
            </div>
          </dl>
          <button type="button" className="btn btn-secondary" onClick={() => setSeleccionadaId(null)}>
            Cerrar detalle
          </button>
        </section>
      )}

      <footer className="app-footer">
        <p>Datos ficticios en memoria. Sin persistencia, red ni base de datos.</p>
      </footer>
    </main>
  );
}
