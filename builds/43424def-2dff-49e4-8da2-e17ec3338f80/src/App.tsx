import { useMemo, useState } from 'react';

type EstadoTarjeta = 'activa' | 'bloqueada' | 'vencida';

interface Tarjeta {
  id: string;
  titular: string;
  numeroEnmascarado: string;
  tipo: 'débito' | 'crédito';
  estado: EstadoTarjeta;
  saldo: number;
  limite: number;
}

const TARJETAS_INICIALES: Tarjeta[] = [
  { id: 'c-1001', titular: 'Ana Rodríguez', numeroEnmascarado: '**** **** **** 4821', tipo: 'crédito', estado: 'activa', saldo: 1250.5, limite: 5000 },
  { id: 'c-1002', titular: 'Luis Fernández', numeroEnmascarado: '**** **** **** 1190', tipo: 'débito', estado: 'activa', saldo: 320.0, limite: 320.0 },
  { id: 'c-1003', titular: 'María Torres', numeroEnmascarado: '**** **** **** 7745', tipo: 'crédito', estado: 'bloqueada', saldo: 4800.0, limite: 5000 },
  { id: 'c-1004', titular: 'Jorge Peña', numeroEnmascarado: '**** **** **** 3302', tipo: 'débito', estado: 'vencida', saldo: 0, limite: 0 },
  { id: 'c-1005', titular: 'Carla Jiménez', numeroEnmascarado: '**** **** **** 9087', tipo: 'crédito', estado: 'activa', saldo: 900.25, limite: 3000 },
];

const ETIQUETA_ESTADO: Record<EstadoTarjeta, string> = {
  activa: 'Activa',
  bloqueada: 'Bloqueada',
  vencida: 'Vencida',
};

function formatearMonto(valor: number): string {
  return valor.toLocaleString('es-ES', { style: 'currency', currency: 'USD' });
}

export default function App() {
  const [tarjetas] = useState<Tarjeta[]>(TARJETAS_INICIALES);
  const [termino, setTermino] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todas' | EstadoTarjeta>('todas');
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null);
  const [mensajeCapacidad, setMensajeCapacidad] = useState('');

  const tarjetasFiltradas = useMemo(() => {
    const terminoNormalizado = termino.trim().toLowerCase();
    return tarjetas.filter((tarjeta) => {
      const coincideTermino =
        terminoNormalizado === '' ||
        tarjeta.titular.toLowerCase().includes(terminoNormalizado) ||
        tarjeta.numeroEnmascarado.toLowerCase().includes(terminoNormalizado) ||
        tarjeta.id.toLowerCase().includes(terminoNormalizado);
      const coincideEstado = filtroEstado === 'todas' || tarjeta.estado === filtroEstado;
      return coincideTermino && coincideEstado;
    });
  }, [tarjetas, termino, filtroEstado]);

  const tarjetaSeleccionada = useMemo(
    () => tarjetas.find((t) => t.id === seleccionadaId) ?? null,
    [tarjetas, seleccionadaId],
  );

  function manejarProbarCapacidad() {
    setMensajeCapacidad('Consulta de Tarjetas');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-eyebrow">App móvil · Tarjetas</p>
          <h1>Consulta de Tarjetas</h1>
          <p className="app-subtitle">
            Busca, filtra y revisa el detalle de las tarjetas registradas. Datos ficticios en memoria.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={manejarProbarCapacidad}>
          Probar capacidad
        </button>
      </header>

      <p role="status" aria-live="polite" className="status-banner">
        {mensajeCapacidad}
      </p>

      <section className="panel" aria-labelledby="titulo-busqueda">
        <h2 id="titulo-busqueda" className="panel-title">
          Buscar tarjetas
        </h2>
        <div className="toolbar">
          <div className="field">
            <label htmlFor="buscar-tarjeta">Titular, número o ID</label>
            <input
              id="buscar-tarjeta"
              type="search"
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              placeholder="Ej. Ana Rodríguez, 4821, c-1001"
            />
          </div>
          <div className="field">
            <label htmlFor="filtro-estado">Estado</label>
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
        </div>
      </section>

      <section className="panel" aria-labelledby="titulo-resultados">
        <div className="panel-header-row">
          <h2 id="titulo-resultados" className="panel-title">
            Resultados
          </h2>
          <span className="contador" aria-label={`${tarjetasFiltradas.length} tarjetas encontradas`}>
            {tarjetasFiltradas.length} / {tarjetas.length}
          </span>
        </div>

        {tarjetasFiltradas.length === 0 ? (
          <p className="estado-vacio">No se encontraron tarjetas con esos criterios.</p>
        ) : (
          <div className="tabla-wrapper">
            <table className="tabla-tarjetas">
              <thead>
                <tr>
                  <th scope="col">Titular</th>
                  <th scope="col">Número</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className="num">Saldo</th>
                  <th scope="col">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {tarjetasFiltradas.map((tarjeta) => (
                  <tr key={tarjeta.id}>
                    <td>{tarjeta.titular}</td>
                    <td>{tarjeta.numeroEnmascarado}</td>
                    <td className="capitalizar">{tarjeta.tipo}</td>
                    <td>
                      <span className={`badge badge-${tarjeta.estado}`}>{ETIQUETA_ESTADO[tarjeta.estado]}</span>
                    </td>
                    <td className="num">{formatearMonto(tarjeta.saldo)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSeleccionadaId(tarjeta.id)}
                        aria-haspopup="dialog"
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
        <div className="overlay" role="presentation" onClick={() => setSeleccionadaId(null)}>
          <section
            className="dialogo"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-dialogo"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="titulo-dialogo">Detalle de tarjeta</h2>
            <dl className="detalle-lista">
              <dt>Titular</dt>
              <dd>{tarjetaSeleccionada.titular}</dd>
              <dt>Número</dt>
              <dd>{tarjetaSeleccionada.numeroEnmascarado}</dd>
              <dt>Tipo</dt>
              <dd className="capitalizar">{tarjetaSeleccionada.tipo}</dd>
              <dt>Estado</dt>
              <dd>
                <span className={`badge badge-${tarjetaSeleccionada.estado}`}>
                  {ETIQUETA_ESTADO[tarjetaSeleccionada.estado]}
                </span>
              </dd>
              <dt>Saldo</dt>
              <dd className="num">{formatearMonto(tarjetaSeleccionada.saldo)}</dd>
              <dt>Límite</dt>
              <dd className="num">{formatearMonto(tarjetaSeleccionada.limite)}</dd>
            </dl>
            <button type="button" className="btn btn-primary" onClick={() => setSeleccionadaId(null)} autoFocus>
              Cerrar
            </button>
          </section>
        </div>
      )}

      <footer className="app-footer">
        <p>Datos ficticios en memoria; sin persistencia ni conexión a servicios externos.</p>
      </footer>
    </main>
  );
}
