import { useMemo, useState } from 'react';

type EstadoTarjeta = 'Activa' | 'Bloqueada';
type TipoTarjeta = 'Débito' | 'Crédito';

interface Tarjeta {
  id: string;
  alias: string;
  numeroEnmascarado: string;
  tipo: TipoTarjeta;
  titular: string;
  estado: EstadoTarjeta;
  saldoDisponible: number;
}

const TARJETAS_INICIALES: Tarjeta[] = [
  {
    id: 'tj-001',
    alias: 'Tarjeta Nómina',
    numeroEnmascarado: '**** **** **** 4821',
    tipo: 'Débito',
    titular: 'Ana Gómez',
    estado: 'Activa',
    saldoDisponible: 3250.75,
  },
  {
    id: 'tj-002',
    alias: 'Visa Oro',
    numeroEnmascarado: '**** **** **** 1190',
    tipo: 'Crédito',
    titular: 'Ana Gómez',
    estado: 'Activa',
    saldoDisponible: 12800.0,
  },
  {
    id: 'tj-003',
    alias: 'Tarjeta Ahorro',
    numeroEnmascarado: '**** **** **** 7745',
    tipo: 'Débito',
    titular: 'Carlos Ruiz',
    estado: 'Bloqueada',
    saldoDisponible: 540.2,
  },
  {
    id: 'tj-004',
    alias: 'Mastercard Negocios',
    numeroEnmascarado: '**** **** **** 3302',
    tipo: 'Crédito',
    titular: 'Carlos Ruiz',
    estado: 'Activa',
    saldoDisponible: 6400.5,
  },
];

const formatoMoneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

function coincideBusqueda(tarjeta: Tarjeta, termino: string): boolean {
  const q = termino.trim().toLowerCase();
  if (!q) return true;
  return (
    tarjeta.alias.toLowerCase().includes(q) ||
    tarjeta.titular.toLowerCase().includes(q) ||
    tarjeta.numeroEnmascarado.toLowerCase().includes(q) ||
    tarjeta.tipo.toLowerCase().includes(q)
  );
}

export default function App() {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>(TARJETAS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todas' | EstadoTarjeta>('Todas');
  const [seleccionId, setSeleccionId] = useState<string | null>(TARJETAS_INICIALES[0]?.id ?? null);
  const [pendienteConfirmacion, setPendienteConfirmacion] = useState<string | null>(null);
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [capacidadProbada, setCapacidadProbada] = useState(false);

  const tarjetasFiltradas = useMemo(() => {
    return tarjetas.filter((t) => {
      const porEstado = filtroEstado === 'Todas' ? true : t.estado === filtroEstado;
      return porEstado && coincideBusqueda(t, busqueda);
    });
  }, [tarjetas, busqueda, filtroEstado]);

  const tarjetaSeleccionada = useMemo(
    () => tarjetas.find((t) => t.id === seleccionId) ?? null,
    [tarjetas, seleccionId]
  );

  function probarCapacidad() {
    setCapacidadProbada(true);
    setMensajeEstado('Consulta de Tarjetas');
  }

  function seleccionarTarjeta(id: string) {
    setSeleccionId(id);
    setPendienteConfirmacion(null);
  }

  function pedirConfirmacionCambioEstado(id: string) {
    setPendienteConfirmacion(id);
  }

  function cancelarConfirmacion() {
    setPendienteConfirmacion(null);
  }

  function confirmarCambioEstado(id: string) {
    setTarjetas((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, estado: t.estado === 'Activa' ? 'Bloqueada' : 'Activa' }
          : t
      )
    );
    const tarjeta = tarjetas.find((t) => t.id === id);
    const nuevoEstado = tarjeta?.estado === 'Activa' ? 'Bloqueada' : 'Activa';
    setMensajeEstado(
      `${tarjeta?.alias ?? 'Tarjeta'} actualizada a estado ${nuevoEstado}.`
    );
    setPendienteConfirmacion(null);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Banca por Internet</p>
          <h1>Consulta de Tarjetas</h1>
          <p className="subtitle">
            Revisa el estado, saldo disponible y titular de las tarjetas en memoria.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={probarCapacidad}>
          Probar capacidad
        </button>
      </header>

      <p role="status" className="status-banner" aria-live="polite">
        {mensajeEstado}
      </p>

      {capacidadProbada && (
        <p className="hint-text">
          Capacidad verificada: datos ficticios en memoria, sin conexión externa.
        </p>
      )}

      <section className="toolbar" aria-label="Filtros de consulta">
        <div className="field">
          <label htmlFor="busqueda-tarjetas">Buscar tarjeta</label>
          <input
            id="busqueda-tarjetas"
            type="search"
            placeholder="Alias, titular, tipo o número"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="filtro-estado">Estado</label>
          <select
            id="filtro-estado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as 'Todas' | EstadoTarjeta)}
          >
            <option value="Todas">Todas</option>
            <option value="Activa">Activa</option>
            <option value="Bloqueada">Bloqueada</option>
          </select>
        </div>
      </section>

      <section className="content-grid">
        <div className="card-list" aria-label="Resultados de la consulta">
          {tarjetasFiltradas.length === 0 ? (
            <p className="empty-state">
              No hay tarjetas que coincidan con la búsqueda o el filtro aplicado.
            </p>
          ) : (
            <ul className="card-list-items">
              {tarjetasFiltradas.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    className={
                      'card-item' + (t.id === seleccionId ? ' card-item-active' : '')
                    }
                    onClick={() => seleccionarTarjeta(t.id)}
                    aria-pressed={t.id === seleccionId}
                  >
                    <span className="card-item-top">
                      <strong>{t.alias}</strong>
                      <span className={`badge badge-${t.estado === 'Activa' ? 'success' : 'danger'}`}>
                        {t.estado}
                      </span>
                    </span>
                    <span className="card-item-sub">{t.numeroEnmascarado}</span>
                    <span className="card-item-sub">{t.tipo} · {t.titular}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-detail" aria-label="Detalle de la tarjeta seleccionada">
          {tarjetaSeleccionada ? (
            <article className="detail-card">
              <header className="detail-header">
                <h2>{tarjetaSeleccionada.alias}</h2>
                <span
                  className={`badge badge-${
                    tarjetaSeleccionada.estado === 'Activa' ? 'success' : 'danger'
                  }`}
                >
                  {tarjetaSeleccionada.estado}
                </span>
              </header>
              <dl className="detail-list">
                <div>
                  <dt>Número</dt>
                  <dd>{tarjetaSeleccionada.numeroEnmascarado}</dd>
                </div>
                <div>
                  <dt>Tipo</dt>
                  <dd>{tarjetaSeleccionada.tipo}</dd>
                </div>
                <div>
                  <dt>Titular</dt>
                  <dd>{tarjetaSeleccionada.titular}</dd>
                </div>
                <div>
                  <dt>Saldo disponible</dt>
                  <dd className="tabular-nums">
                    {formatoMoneda.format(tarjetaSeleccionada.saldoDisponible)}
                  </dd>
                </div>
              </dl>

              {pendienteConfirmacion === tarjetaSeleccionada.id ? (
                <div className="confirm-box" role="group" aria-label="Confirmar cambio de estado">
                  <p>
                    ¿Confirmas cambiar el estado a{' '}
                    <strong>
                      {tarjetaSeleccionada.estado === 'Activa' ? 'Bloqueada' : 'Activa'}
                    </strong>
                    ?
                  </p>
                  <div className="confirm-actions">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => confirmarCambioEstado(tarjetaSeleccionada.id)}
                    >
                      Confirmar
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={cancelarConfirmacion}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => pedirConfirmacionCambioEstado(tarjetaSeleccionada.id)}
                >
                  {tarjetaSeleccionada.estado === 'Activa' ? 'Bloquear tarjeta' : 'Activar tarjeta'}
                </button>
              )}
            </article>
          ) : (
            <p className="empty-state">Selecciona una tarjeta de la lista para ver su detalle.</p>
          )}
        </div>
      </section>

      <footer className="app-footer">
        <p>Datos ficticios en memoria. Sin conexión a servicios externos ni persistencia.</p>
      </footer>
    </main>
  );
}
