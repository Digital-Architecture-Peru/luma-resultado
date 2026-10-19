import { useMemo, useState } from 'react';

type EstadoPago = 'Pendiente' | 'Pagado' | 'Rechazado';

interface Pago {
  id: string;
  beneficiario: string;
  referencia: string;
  monto: number;
  fecha: string;
  estado: EstadoPago;
}

const PAGOS_INICIALES: Pago[] = [
  { id: 'PG-1001', beneficiario: 'Compañía de Luz S.A.', referencia: 'FAC-88231', monto: 125000.5, fecha: '2026-10-01', estado: 'Pagado' },
  { id: 'PG-1002', beneficiario: 'Telecom Andina', referencia: 'FAC-77102', monto: 48200, fecha: '2026-10-05', estado: 'Pendiente' },
  { id: 'PG-1003', beneficiario: 'Universidad Central', referencia: 'MAT-2026-02', monto: 980000, fecha: '2026-10-08', estado: 'Pagado' },
  { id: 'PG-1004', beneficiario: 'Seguros Vida Plus', referencia: 'POL-55120', monto: 215300, fecha: '2026-10-11', estado: 'Rechazado' },
  { id: 'PG-1005', beneficiario: 'Agua Metropolitana', referencia: 'FAC-90044', monto: 32750.25, fecha: '2026-10-14', estado: 'Pendiente' },
  { id: 'PG-1006', beneficiario: 'Colegio San Marcos', referencia: 'PEN-2026-10', monto: 650000, fecha: '2026-10-16', estado: 'Pagado' },
];

const FORMATO_MONEDA = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 2 });

function formatearFecha(fecha: string): string {
  const d = new Date(fecha + 'T00:00:00');
  return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: '2-digit' });
}

function claseEstado(estado: EstadoPago): string {
  if (estado === 'Pagado') return 'badge badge--success';
  if (estado === 'Rechazado') return 'badge badge--danger';
  return 'badge badge--pending';
}

export default function App() {
  const [pagos] = useState<Pago[]>(PAGOS_INICIALES);
  const [texto, setTexto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | EstadoPago>('Todos');
  const [seleccionado, setSeleccionado] = useState<Pago | null>(null);
  const [mensajeDemo, setMensajeDemo] = useState('');

  const pagosFiltrados = useMemo(() => {
    const q = texto.trim().toLowerCase();
    return pagos.filter((p) => {
      const coincideTexto =
        q.length === 0 ||
        p.beneficiario.toLowerCase().includes(q) ||
        p.referencia.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);
      const coincideEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }, [pagos, texto, filtroEstado]);

  const totalFiltrado = useMemo(
    () => pagosFiltrados.reduce((acc, p) => acc + p.monto, 0),
    [pagosFiltrados]
  );

  function manejarProbarCapacidad() {
    setMensajeDemo('Consulta de Pagos');
  }

  function verDetalle(pago: Pago) {
    setSeleccionado(pago);
  }

  function cerrarDetalle() {
    setSeleccionado(null);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Banca por Internet</p>
          <h1>Consulta de Pagos</h1>
          <p className="subtitle">Revisa el historial de pagos registrados, filtra por estado y busca por beneficiario o referencia.</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={manejarProbarCapacidad}>
          Probar capacidad
        </button>
      </header>

      <p role="status" aria-live="polite" className="demo-status">
        {mensajeDemo}
      </p>

      <section className="panel" aria-labelledby="filtros-titulo">
        <h2 id="filtros-titulo" className="visually-hidden">Filtros de búsqueda</h2>
        <div className="filtros">
          <div className="campo">
            <label htmlFor="busqueda">Buscar por beneficiario, referencia o ID</label>
            <input
              id="busqueda"
              type="search"
              placeholder="Ej. Telecom Andina, FAC-77102, PG-1002"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as 'Todos' | EstadoPago)}
            >
              <option value="Todos">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>
        </div>
        <p className="resumen">
          {pagosFiltrados.length} resultado(s) · Total: <strong>{FORMATO_MONEDA.format(totalFiltrado)}</strong>
        </p>
      </section>

      <section className="panel" aria-labelledby="tabla-titulo">
        <h2 id="tabla-titulo">Historial de pagos</h2>
        {pagosFiltrados.length === 0 ? (
          <p className="estado-vacio">No se encontraron pagos con los criterios actuales.</p>
        ) : (
          <div className="tabla-scroll">
            <table className="tabla-pagos">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Beneficiario</th>
                  <th scope="col">Referencia</th>
                  <th scope="col">Fecha</th>
                  <th scope="col" className="num">Monto</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {pagosFiltrados.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.beneficiario}</td>
                    <td>{p.referencia}</td>
                    <td>{formatearFecha(p.fecha)}</td>
                    <td className="num">{FORMATO_MONEDA.format(p.monto)}</td>
                    <td><span className={claseEstado(p.estado)}>{p.estado}</span></td>
                    <td>
                      <button type="button" className="btn btn--ghost" onClick={() => verDetalle(p)}>
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

      {seleccionado && (
        <div className="overlay" role="presentation" onClick={cerrarDetalle}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detalle-titulo"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="detalle-titulo">Detalle del pago {seleccionado.id}</h2>
            <dl className="detalle-lista">
              <div>
                <dt>Beneficiario</dt>
                <dd>{seleccionado.beneficiario}</dd>
              </div>
              <div>
                <dt>Referencia</dt>
                <dd>{seleccionado.referencia}</dd>
              </div>
              <div>
                <dt>Fecha</dt>
                <dd>{formatearFecha(seleccionado.fecha)}</dd>
              </div>
              <div>
                <dt>Monto</dt>
                <dd>{FORMATO_MONEDA.format(seleccionado.monto)}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd><span className={claseEstado(seleccionado.estado)}>{seleccionado.estado}</span></dd>
              </div>
            </dl>
            <button type="button" className="btn btn--primary" onClick={cerrarDetalle}>
              Cerrar
            </button>
          </section>
        </div>
      )}

      <footer className="app-footer">
        <p>Datos ficticios en memoria, sin conexión a sistemas reales. Candidate — no es una versión de producción.</p>
      </footer>
    </main>
  );
}
