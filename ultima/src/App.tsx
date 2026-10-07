import { useMemo, useState } from 'react';

type EstadoTarjeta = 'activa' | 'bloqueada' | 'vencida';

interface Tarjeta {
  id: string;
  titular: string;
  numeroEnmascarado: string;
  tipo: 'débito' | 'crédito';
  estado: EstadoTarjeta;
  saldo: number;
}

const TARJETAS_INICIALES: Tarjeta[] = [
  { id: 't1', titular: 'Ana Rodríguez', numeroEnmascarado: '**** **** **** 4821', tipo: 'crédito', estado: 'activa', saldo: 1520.4 },
  { id: 't2', titular: 'Carlos Pérez', numeroEnmascarado: '**** **** **** 1190', tipo: 'débito', estado: 'activa', saldo: 320.0 },
  { id: 't3', titular: 'María Gómez', numeroEnmascarado: '**** **** **** 7734', tipo: 'crédito', estado: 'bloqueada', saldo: 0 },
  { id: 't4', titular: 'Luis Fernández', numeroEnmascarado: '**** **** **** 2290', tipo: 'débito', estado: 'vencida', saldo: 85.75 },
];

const ESTADO_LABEL: Record<EstadoTarjeta, string> = {
  activa: 'Activa',
  bloqueada: 'Bloqueada',
  vencida: 'Vencida',
};

function formatearMonto(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(valor);
}

let contadorId = TARJETAS_INICIALES.length;

export default function App() {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>(TARJETAS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionId, setSeleccionId] = useState<string | null>(null);
  const [confirmarEliminarId, setConfirmarEliminarId] = useState<string | null>(null);
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [capacidadProbada, setCapacidadProbada] = useState(false);

  const [titularNuevo, setTitularNuevo] = useState('');
  const [tipoNuevo, setTipoNuevo] = useState<'débito' | 'crédito'>('débito');
  const [numeroNuevo, setNumeroNuevo] = useState('');
  const [errorFormulario, setErrorFormulario] = useState('');

  const tarjetasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return tarjetas;
    return tarjetas.filter(
      (t) =>
        t.titular.toLowerCase().includes(termino) ||
        t.numeroEnmascarado.toLowerCase().includes(termino) ||
        t.estado.toLowerCase().includes(termino)
    );
  }, [tarjetas, busqueda]);

  const tarjetaSeleccionada = tarjetas.find((t) => t.id === seleccionId) ?? null;

  function probarCapacidad() {
    setCapacidadProbada(true);
    setMensajeEstado('Consulta de Tarjetas');
  }

  function agregarTarjeta() {
    const titular = titularNuevo.trim();
    const ultimosDigitos = numeroNuevo.trim();
    if (!titular) {
      setErrorFormulario('El nombre del titular es obligatorio.');
      return;
    }
    if (!/^\d{4}$/.test(ultimosDigitos)) {
      setErrorFormulario('Ingresa los últimos 4 dígitos del número de tarjeta.');
      return;
    }
    const nueva: Tarjeta = {
      id: `t${++contadorId}`,
      titular,
      numeroEnmascarado: `**** **** **** ${ultimosDigitos}`,
      tipo: tipoNuevo,
      estado: 'activa',
      saldo: 0,
    };
    setTarjetas((prev) => [nueva, ...prev]);
    setTitularNuevo('');
    setNumeroNuevo('');
    setErrorFormulario('');
    setMensajeEstado(`Tarjeta de ${titular} agregada.`);
  }

  function pedirEliminar(id: string) {
    setConfirmarEliminarId(id);
  }

  function confirmarEliminar(id: string) {
    const tarjeta = tarjetas.find((t) => t.id === id);
    setTarjetas((prev) => prev.filter((t) => t.id !== id));
    if (seleccionId === id) setSeleccionId(null);
    setConfirmarEliminarId(null);
    setMensajeEstado(tarjeta ? `Tarjeta de ${tarjeta.titular} eliminada.` : 'Tarjeta eliminada.');
  }

  function cancelarEliminar() {
    setConfirmarEliminarId(null);
  }

  function alternarBloqueo(id: string) {
    setTarjetas((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, estado: t.estado === 'bloqueada' ? 'activa' : 'bloqueada' } : t
      )
    );
    const tarjeta = tarjetas.find((t) => t.id === id);
    if (tarjeta) {
      const nuevoEstado = tarjeta.estado === 'bloqueada' ? 'Activa' : 'Bloqueada';
      setMensajeEstado(`Tarjeta de ${tarjeta.titular} ahora está ${nuevoEstado}.`);
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">App móvil · Frontend · Component-based</p>
          <h1>Consulta de Tarjetas</h1>
          <p className="app-subtitle">Busca, revisa y administra tarjetas ficticias en memoria.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={probarCapacidad}>
          Probar capacidad
        </button>
      </header>

      <p role="status" aria-live="polite" className="status-banner">
        {mensajeEstado}
      </p>

      {capacidadProbada && (
        <section className="panel panel-highlight" aria-label="Resultado de la capacidad probada">
          <h2>Consulta de Tarjetas</h2>
          <p>La capacidad de consulta está lista: usa el buscador y la lista para explorar las tarjetas.</p>
        </section>
      )}

      <section className="panel" aria-labelledby="buscar-titulo">
        <h2 id="buscar-titulo">Buscar tarjetas</h2>
        <div className="field-group">
          <label htmlFor="buscador">Titular, número o estado</label>
          <input
            id="buscador"
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Ej: Ana, 4821, bloqueada"
          />
        </div>
      </section>

      <section className="panel" aria-labelledby="alta-titulo">
        <h2 id="alta-titulo">Agregar tarjeta</h2>
        <div className="form-grid">
          <div className="field-group">
            <label htmlFor="titular">Titular</label>
            <input id="titular" type="text" value={titularNuevo} onChange={(e) => setTitularNuevo(e.target.value)} />
          </div>
          <div className="field-group">
            <label htmlFor="ultimos-digitos">Últimos 4 dígitos</label>
            <input
              id="ultimos-digitos"
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={numeroNuevo}
              onChange={(e) => setNumeroNuevo(e.target.value)}
            />
          </div>
          <div className="field-group">
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" value={tipoNuevo} onChange={(e) => setTipoNuevo(e.target.value as 'débito' | 'crédito')}>
              <option value="débito">Débito</option>
              <option value="crédito">Crédito</option>
            </select>
          </div>
          <div className="field-group field-group-action">
            <button type="button" className="btn btn-secondary" onClick={agregarTarjeta}>
              Agregar
            </button>
          </div>
        </div>
        {errorFormulario && (
          <p role="alert" className="field-error">
            {errorFormulario}
          </p>
        )}
      </section>

      <section className="panel" aria-labelledby="lista-titulo">
        <h2 id="lista-titulo">Tarjetas ({tarjetasFiltradas.length})</h2>
        {tarjetasFiltradas.length === 0 ? (
          <p className="empty-state">No hay tarjetas que coincidan con la búsqueda.</p>
        ) : (
          <ul className="card-list">
            {tarjetasFiltradas.map((t) => (
              <li key={t.id} className={`card-item estado-${t.estado}`}>
                <button
                  type="button"
                  className="card-item-main"
                  onClick={() => setSeleccionId(t.id)}
                  aria-pressed={seleccionId === t.id}
                >
                  <span className="card-titular">{t.titular}</span>
                  <span className="card-numero">{t.numeroEnmascarado}</span>
                  <span className={`badge badge-${t.estado}`}>{ESTADO_LABEL[t.estado]}</span>
                </button>
                <div className="card-item-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => alternarBloqueo(t.id)}>
                    {t.estado === 'bloqueada' ? 'Desbloquear' : 'Bloquear'}
                  </button>
                  {confirmarEliminarId === t.id ? (
                    <span className="confirm-inline">
                      <span>¿Eliminar?</span>
                      <button type="button" className="btn btn-danger" onClick={() => confirmarEliminar(t.id)}>
                        Sí
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={cancelarEliminar}>
                        No
                      </button>
                    </span>
                  ) : (
                    <button type="button" className="btn btn-danger" onClick={() => pedirEliminar(t.id)}>
                      Eliminar
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {tarjetaSeleccionada && (
        <section className="panel panel-detail" aria-labelledby="detalle-titulo">
          <h2 id="detalle-titulo">Detalle de {tarjetaSeleccionada.titular}</h2>
          <dl className="detail-grid">
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
              <dd>{ESTADO_LABEL[tarjetaSeleccionada.estado]}</dd>
            </div>
            <div>
              <dt>Saldo</dt>
              <dd>{formatearMonto(tarjetaSeleccionada.saldo)}</dd>
            </div>
          </dl>
        </section>
      )}
    </main>
  );
}
