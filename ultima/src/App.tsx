import { useMemo, useState } from 'react';

type EstadoPago = 'Aplicado' | 'Pendiente' | 'Rechazado';

interface Pago {
  id: string;
  beneficiario: string;
  referencia: string;
  monto: number;
  fecha: string;
  estado: EstadoPago;
}

const PAGOS_INICIALES: Pago[] = [
  { id: 'PG-1001', beneficiario: 'Compañía de Luz Nacional', referencia: 'REF-884201', monto: 128500, fecha: '2026-10-02', estado: 'Aplicado' },
  { id: 'PG-1002', beneficiario: 'Telecom Andina', referencia: 'REF-884202', monto: 54200, fecha: '2026-10-05', estado: 'Aplicado' },
  { id: 'PG-1003', beneficiario: 'Seguros del Valle', referencia: 'REF-884203', monto: 310000, fecha: '2026-10-08', estado: 'Pendiente' },
  { id: 'PG-1004', beneficiario: 'Universidad Central', referencia: 'REF-884204', monto: 980000, fecha: '2026-10-10', estado: 'Aplicado' },
  { id: 'PG-1005', beneficiario: 'Tarjeta de Crédito Plus', referencia: 'REF-884205', monto: 452300, fecha: '2026-10-12', estado: 'Rechazado' },
  { id: 'PG-1006', beneficiario: 'Administración Conjunto Residencial', referencia: 'REF-884206', monto: 215000, fecha: '2026-10-14', estado: 'Pendiente' },
  { id: 'PG-1007', beneficiario: 'Compañía de Luz Nacional', referencia: 'REF-884207', monto: 131200, fecha: '2026-10-16', estado: 'Aplicado' },
];

const formatoMoneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

function formatearFecha(fechaIso: string): string {
  const fecha = new Date(fechaIso + 'T00:00:00');
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(fecha);
}

type FiltroEstado = 'Todos' | EstadoPago;

export default function App() {
  const [capacidadMensaje, setCapacidadMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('Todos');
  const [pagoSeleccionadoId, setPagoSeleccionadoId] = useState<string | null>(null);
  const [anuncio, setAnuncio] = useState('');

  const pagos = PAGOS_INICIALES;

  const pagosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return pagos.filter((pago) => {
      const coincideEstado = filtroEstado === 'Todos' || pago.estado === filtroEstado;
      if (!coincideEstado) return false;
      if (!termino) return true;
      return (
        pago.beneficiario.toLowerCase().includes(termino) ||
        pago.referencia.toLowerCase().includes(termino) ||
        pago.id.toLowerCase().includes(termino)
      );
    });
  }, [busqueda, filtroEstado, pagos]);

  const pagoSeleccionado = useMemo(
    () => pagos.find((pago) => pago.id === pagoSeleccionadoId) ?? null,
    [pagoSeleccionadoId, pagos]
  );

  const totalFiltrado = useMemo(
    () => pagosFiltrados.reduce((suma, pago) => suma + pago.monto, 0),
    [pagosFiltrados]
  );

  function manejarProbarCapacidad() {
    setCapacidadMensaje('Consulta de Pagos');
  }

  function seleccionarPago(id: string) {
    setPagoSeleccionadoId(id);
    const pago = pagos.find((p) => p.id === id);
    if (pago) {
      setAnuncio(`Detalle mostrado para el pago ${pago.id} de ${pago.beneficiario}.`);
    }
  }

  function limpiarFiltros() {
    setBusqueda('');
    setFiltroEstado('Todos');
    setAnuncio('Filtros de búsqueda limpiados.');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="app-header__titles">
          <p className="app-header__eyebrow">Banca por Internet · Pagos</p>
          <h1 className="app-header__title">Consulta de Pagos</h1>
          <p className="app-header__subtitle">
            Busca, filtra y revisa el detalle de los pagos realizados desde tu cuenta. Datos de demostración, sin conexión.
          </p>
        </div>
        <div className="app-header__action">
          <button type="button" className="btn btn--primary" onClick={manejarProbarCapacidad}>
            Probar capacidad
          </button>
          <p className="capacidad-resultado" role="status">
            {capacidadMensaje}
          </p>
        </div>
      </header>

      <section className="panel" aria-labelledby="buscar-titulo">
        <h2 id="buscar-titulo" className="panel__titulo">Buscar pagos</h2>
        <div className="filtros">
          <div className="campo">
            <label htmlFor="buscar-pago">Beneficiario, referencia o número de pago</label>
            <input
              id="buscar-pago"
              type="search"
              placeholder="Ej. Telecom Andina, REF-884203, PG-1004"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="filtro-estado">Estado</label>
            <select
              id="filtro-estado"
              value={filtroEstado}
              onChange={(evento) => setFiltroEstado(evento.target.value as FiltroEstado)}
            >
              <option value="Todos">Todos</option>
              <option value="Aplicado">Aplicado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>
          <div className="campo campo--accion">
            <button type="button" className="btn btn--secundario" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          </div>
        </div>
        <p className="resumen-filtro">
          {pagosFiltrados.length} resultado{pagosFiltrados.length === 1 ? '' : 's'} · Total {formatoMoneda.format(totalFiltrado)}
        </p>
      </section>

      <section className="panel" aria-labelledby="resultados-titulo">
        <h2 id="resultados-titulo" className="panel__titulo">Resultados</h2>
        {pagosFiltrados.length === 0 ? (
          <p className="estado-vacio">No se encontraron pagos con esos criterios. Ajusta la búsqueda o el estado.</p>
        ) : (
          <div className="tabla-contenedor">
            <table className="tabla-pagos">
              <thead>
                <tr>
                  <th scope="col">Pago</th>
                  <th scope="col">Beneficiario</th>
                  <th scope="col">Referencia</th>
                  <th scope="col">Fecha</th>
                  <th scope="col" className="col-numerica">Monto</th>
                  <th scope="col">Estado</th>
                  <th scope="col"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {pagosFiltrados.map((pago) => (
                  <tr key={pago.id} className={pago.id === pagoSeleccionadoId ? 'fila-activa' : undefined}>
                    <td>{pago.id}</td>
                    <td>{pago.beneficiario}</td>
                    <td>{pago.referencia}</td>
                    <td>{formatearFecha(pago.fecha)}</td>
                    <td className="col-numerica">{formatoMoneda.format(pago.monto)}</td>
                    <td>
                      <span className={`badge badge--${pago.estado.toLowerCase()}`}>{pago.estado}</span>
                    </td>
                    <td>
                      <button type="button" className="btn btn--enlace" onClick={() => seleccionarPago(pago.id)}>
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

      {pagoSeleccionado && (
        <section className="panel panel--detalle" aria-labelledby="detalle-titulo">
          <h2 id="detalle-titulo" className="panel__titulo">Detalle del pago {pagoSeleccionado.id}</h2>
          <dl className="detalle-grid">
            <div>
              <dt>Beneficiario</dt>
              <dd>{pagoSeleccionado.beneficiario}</dd>
            </div>
            <div>
              <dt>Referencia</dt>
              <dd>{pagoSeleccionado.referencia}</dd>
            </div>
            <div>
              <dt>Fecha</dt>
              <dd>{formatearFecha(pagoSeleccionado.fecha)}</dd>
            </div>
            <div>
              <dt>Monto</dt>
              <dd>{formatoMoneda.format(pagoSeleccionado.monto)}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>
                <span className={`badge badge--${pagoSeleccionado.estado.toLowerCase()}`}>{pagoSeleccionado.estado}</span>
              </dd>
            </div>
          </dl>
        </section>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {anuncio}
      </p>
    </main>
  );
}
