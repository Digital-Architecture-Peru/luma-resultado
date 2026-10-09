import { useMemo, useState } from 'react';

type EstadoTarjeta = 'activa' | 'bloqueada' | 'vencida';

interface Tarjeta {
  id: string;
  alias: string;
  titular: string;
  numeroEnmascarado: string;
  tipo: 'Débito' | 'Crédito';
  estado: EstadoTarjeta;
  saldoDisponible: number;
  limite: number;
}

const TARJETAS_INICIALES: Tarjeta[] = [
  { id: 'tj-1001', alias: 'Nómina', titular: 'Ana María Rojas', numeroEnmascarado: '•••• •••• •••• 4821', tipo: 'Débito', estado: 'activa', saldoDisponible: 3_250_000, limite: 3_250_000 },
  { id: 'tj-1002', alias: 'Viajes', titular: 'Ana María Rojas', numeroEnmascarado: '•••• •••• •••• 1190', tipo: 'Crédito', estado: 'activa', saldoDisponible: 1_840_500, limite: 5_000_000 },
  { id: 'tj-1003', alias: 'Ahorro joven', titular: 'Carlos Peña', numeroEnmascarado: '•••• •••• •••• 7342', tipo: 'Débito', estado: 'bloqueada', saldoDisponible: 0, limite: 980_000 },
  { id: 'tj-1004', alias: 'Negocios', titular: 'Carlos Peña', numeroEnmascarado: '•••• •••• •••• 5509', tipo: 'Crédito', estado: 'vencida', saldoDisponible: 0, limite: 8_000_000 },
];

const ESTADO_ETIQUETA: Record<EstadoTarjeta, string> = {
  activa: 'Activa',
  bloqueada: 'Bloqueada',
  vencida: 'Vencida',
};

function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}

export default function App() {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>(TARJETAS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todas' | EstadoTarjeta>('todas');
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(TARJETAS_INICIALES[0]?.id ?? null);
  const [confirmandoBloqueoId, setConfirmandoBloqueoId] = useState<string | null>(null);
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [capacidadProbada, setCapacidadProbada] = useState(false);

  const tarjetasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return tarjetas.filter((t) => {
      const coincideTexto =
        texto === '' ||
        t.alias.toLowerCase().includes(texto) ||
        t.titular.toLowerCase().includes(texto) ||
        t.numeroEnmascarado.toLowerCase().includes(texto);
      const coincideEstado = filtroEstado === 'todas' || t.estado === filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }, [tarjetas, busqueda, filtroEstado]);

  const tarjetaSeleccionada = tarjetas.find((t) => t.id === seleccionadaId) ?? null;

  function manejarProbarCapacidad() {
    setCapacidadProbada(true);
    setMensajeEstado('Consulta de Tarjetas');
  }

  function solicitarBloqueo(id: string) {
    setConfirmandoBloqueoId(id);
    setMensajeEstado('Confirma el bloqueo de la tarjeta antes de continuar.');
  }

  function cancelarBloqueo() {
    setConfirmandoBloqueoId(null);
    setMensajeEstado('Bloqueo cancelado.');
  }

  function confirmarBloqueo(id: string) {
    setTarjetas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, estado: 'bloqueada', saldoDisponible: 0 } : t)),
    );
    setConfirmandoBloqueoId(null);
    const alias = tarjetas.find((t) => t.id === id)?.alias ?? 'tarjeta';
    setMensajeEstado(`Tarjeta "${alias}" bloqueada correctamente.`);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">Banca por Internet</p>
          <h1>Consulta de Tarjetas</h1>
          <p className="app-subtitle">Revisa el estado, saldo y detalle de tus tarjetas en un solo lugar.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={manejarProbarCapacidad}>
          Probar capacidad
        </button>
      </header>

      <p role="status" aria-live="polite" className="status-banner">
        {mensajeEstado}
      </p>

      {capacidadProbada && (
        <section className="panel panel-highlight" aria-label="Resultado de la capacidad probada">
          <h2>Consulta de Tarjetas</h2>
          <p>La capacidad respondió correctamente con datos ficticios en memoria.</p>
        </section>
      )}

      <section className="panel" aria-label="Filtros de búsqueda">
        <div className="field-group">
          <label htmlFor="busqueda-tarjetas">Buscar por alias, titular o número</label>
          <input
            id="busqueda-tarjetas"
            type="search"
            placeholder="Ej: Nómina, Ana María, 4821"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="filtro-estado">Filtrar por estado</label>
          <select
            id="filtro-estado"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as 'todas' | EstadoTarjeta)}
          >
            <option value="todas">Todas</option>
            <option value="activa">Activa</option>
            <option value="bloqueada">Bloqueada</option>
            <option value="vencida">Vencida</option>
          </select>
        </div>
      </section>

      <section className="panel" aria-label="Resultados de tarjetas">
        <h2 className="visually-hidden">Listado de tarjetas</h2>
        {tarjetasFiltradas.length === 0 ? (
          <p className="empty-state">No se encontraron tarjetas con los criterios indicados.</p>
        ) : (
          <ul className="card-list">
            {tarjetasFiltradas.map((t) => (
              <li key={t.id} className={`card-item ${t.id === seleccionadaId ? 'card-item-active' : ''}`}>
                <button
                  type="button"
                  className="card-item-button"
                  onClick={() => setSeleccionadaId(t.id)}
                  aria-pressed={t.id === seleccionadaId}
                >
                  <div className="card-item-top">
                    <span className="card-alias">{t.alias}</span>
                    <span className={`badge badge-${t.estado}`}>{ESTADO_ETIQUETA[t.estado]}</span>
                  </div>
                  <span className="card-number">{t.numeroEnmascarado}</span>
                  <span className="card-titular">{t.titular} · {t.tipo}</span>
                  <span className="card-saldo">Disponible: {formatearMoneda(t.saldoDisponible)}</span>
                </button>

                {t.estado !== 'bloqueada' && confirmandoBloqueoId !== t.id && (
                  <button type="button" className="btn btn-danger-ghost" onClick={() => solicitarBloqueo(t.id)}>
                    Bloquear tarjeta
                  </button>
                )}
                {confirmandoBloqueoId === t.id && (
                  <div className="confirm-row" role="group" aria-label={`Confirmar bloqueo de ${t.alias}`}>
                    <span>¿Confirmas bloquear "{t.alias}"?</span>
                    <button type="button" className="btn btn-danger" onClick={() => confirmarBloqueo(t.id)}>
                      Sí, bloquear
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={cancelarBloqueo}>
                      Cancelar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {tarjetaSeleccionada && (
        <section className="panel panel-detail" aria-label="Detalle de la tarjeta seleccionada">
          <h2>Detalle</h2>
          <dl className="detail-grid">
            <div>
              <dt>Alias</dt>
              <dd>{tarjetaSeleccionada.alias}</dd>
            </div>
            <div>
              <dt>Titular</dt>
              <dd>{tarjetaSeleccionada.titular}</dd>
            </div>
            <div>
              <dt>Número</dt>
              <dd>{tarjetaSeleccionada.numeroEnmascarado}</dd>
            </div>
            <div>
              <dt>Tipo</dt>
              <dd>{tarjetaSeleccionada.tipo}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>
                <span className={`badge badge-${tarjetaSeleccionada.estado}`}>
                  {ESTADO_ETIQUETA[tarjetaSeleccionada.estado]}
                </span>
              </dd>
            </div>
            <div>
              <dt>Disponible</dt>
              <dd>{formatearMoneda(tarjetaSeleccionada.saldoDisponible)}</dd>
            </div>
            <div>
              <dt>Límite</dt>
              <dd>{formatearMoneda(tarjetaSeleccionada.limite)}</dd>
            </div>
          </dl>
        </section>
      )}
    </main>
  );
}
