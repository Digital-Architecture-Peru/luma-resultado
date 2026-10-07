import { useMemo, useState } from 'react';

type EstadoTarjeta = 'Activa' | 'Bloqueada' | 'Vencida';

interface Tarjeta {
  id: string;
  titular: string;
  numeroMasked: string;
  tipo: 'Débito' | 'Crédito';
  estado: EstadoTarjeta;
  saldo: number;
  empresa: string;
}

const TARJETAS_INICIALES: Tarjeta[] = [
  { id: 'T-1001', titular: 'María Gómez', numeroMasked: '**** **** **** 4821', tipo: 'Crédito', estado: 'Activa', saldo: 12500.5, empresa: 'Andina Logística SAS' },
  { id: 'T-1002', titular: 'Carlos Pérez', numeroMasked: '**** **** **** 2290', tipo: 'Débito', estado: 'Activa', saldo: 3420.0, empresa: 'Andina Logística SAS' },
  { id: 'T-1003', titular: 'Lucía Fernández', numeroMasked: '**** **** **** 7745', tipo: 'Crédito', estado: 'Bloqueada', saldo: 0, empresa: 'Rutas del Sur Ltda' },
  { id: 'T-1004', titular: 'Jorge Ramírez', numeroMasked: '**** **** **** 1038', tipo: 'Débito', estado: 'Vencida', saldo: 150.75, empresa: 'Rutas del Sur Ltda' },
  { id: 'T-1005', titular: 'Ana Torres', numeroMasked: '**** **** **** 6612', tipo: 'Crédito', estado: 'Activa', saldo: 8740.2, empresa: 'Comercial Norte SA' },
  { id: 'T-1006', titular: 'Pedro Salinas', numeroMasked: '**** **** **** 3390', tipo: 'Débito', estado: 'Activa', saldo: 2100.0, empresa: 'Comercial Norte SA' },
];

const ESTADOS: Array<'Todos' | EstadoTarjeta> = ['Todos', 'Activa', 'Bloqueada', 'Vencida'];

function formatearMoneda(valor: number): string {
  return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 2 });
}

function estadoAccesible(estado: EstadoTarjeta): string {
  if (estado === 'Activa') return 'Activa';
  if (estado === 'Bloqueada') return 'Bloqueada';
  return 'Vencida';
}

export default function App() {
  const [capacidadStatus, setCapacidadStatus] = useState('');
  const [tarjetas] = useState<Tarjeta[]>(TARJETAS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | EstadoTarjeta>('Todos');
  const [seleccionId, setSeleccionId] = useState<string | null>(null);
  const [mensajeConsulta, setMensajeConsulta] = useState('');

  const resultados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return tarjetas.filter((t) => {
      const coincideEstado = filtroEstado === 'Todos' || t.estado === filtroEstado;
      const coincideTexto =
        termino.length === 0 ||
        t.titular.toLowerCase().includes(termino) ||
        t.id.toLowerCase().includes(termino) ||
        t.empresa.toLowerCase().includes(termino) ||
        t.numeroMasked.toLowerCase().includes(termino);
      return coincideEstado && coincideTexto;
    });
  }, [tarjetas, busqueda, filtroEstado]);

  const tarjetaSeleccionada = useMemo(
    () => tarjetas.find((t) => t.id === seleccionId) ?? null,
    [tarjetas, seleccionId]
  );

  function probarCapacidad() {
    setCapacidadStatus('Consulta de Tarjetas');
  }

  function consultarTarjeta(t: Tarjeta) {
    setSeleccionId(t.id);
    setMensajeConsulta(`Consulta confirmada: tarjeta ${t.id} de ${t.titular} (${estadoAccesible(t.estado)}).`);
  }

  function limpiarFiltros() {
    setBusqueda('');
    setFiltroEstado('Todos');
    setSeleccionId(null);
    setMensajeConsulta('');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="app-header__text">
          <p className="app-header__eyebrow">Portal empresas</p>
          <h1>Consulta de Tarjetas</h1>
          <p className="app-header__desc">
            Busca y revisa el estado de las tarjetas emitidas a tus empresas afiliadas. Datos de demostración en memoria.
          </p>
        </div>
        <div className="app-header__actions">
          <button type="button" className="btn btn--primary" onClick={probarCapacidad}>
            Probar capacidad
          </button>
          <p role="status" aria-live="polite" className="status-banner">
            {capacidadStatus}
          </p>
        </div>
      </header>

      <section className="panel" aria-labelledby="filtros-titulo">
        <h2 id="filtros-titulo" className="panel__title">Filtros de búsqueda</h2>
        <div className="filtros">
          <div className="campo">
            <label htmlFor="busqueda">Buscar por titular, empresa, ID o número</label>
            <input
              id="busqueda"
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ej. María Gómez, T-1001, Andina"
              autoComplete="off"
            />
          </div>
          <div className="campo">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as 'Todos' | EstadoTarjeta)}
            >
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
          <button type="button" className="btn btn--secondary" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      </section>

      <section className="panel" aria-labelledby="resultados-titulo">
        <div className="panel__header-row">
          <h2 id="resultados-titulo" className="panel__title">Resultados</h2>
          <span className="contador">{resultados.length} tarjeta(s) encontrada(s)</span>
        </div>

        {resultados.length === 0 ? (
          <p className="estado-vacio">No se encontraron tarjetas con los criterios indicados.</p>
        ) : (
          <div className="tabla-wrapper">
            <table className="tabla">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Titular</th>
                  <th scope="col">Empresa</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Número</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className="num">Saldo</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((t) => (
                  <tr key={t.id} className={seleccionId === t.id ? 'fila--seleccionada' : ''}>
                    <td>{t.id}</td>
                    <td>{t.titular}</td>
                    <td>{t.empresa}</td>
                    <td>{t.tipo}</td>
                    <td>{t.numeroMasked}</td>
                    <td>
                      <span className={`badge badge--${t.estado.toLowerCase()}`}>{estadoAccesible(t.estado)}</span>
                    </td>
                    <td className="num">{formatearMoneda(t.saldo)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => consultarTarjeta(t)}
                        aria-label={`Consultar detalle de tarjeta ${t.id} de ${t.titular}`}
                      >
                        Consultar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {mensajeConsulta && (
        <section className="panel panel--detalle" aria-labelledby="detalle-titulo">
          <h2 id="detalle-titulo" className="panel__title">Detalle de la consulta</h2>
          <p role="status" aria-live="polite" className="mensaje-confirmacion">{mensajeConsulta}</p>
          {tarjetaSeleccionada && (
            <dl className="detalle-grid">
              <div><dt>ID</dt><dd>{tarjetaSeleccionada.id}</dd></div>
              <div><dt>Titular</dt><dd>{tarjetaSeleccionada.titular}</dd></div>
              <div><dt>Empresa</dt><dd>{tarjetaSeleccionada.empresa}</dd></div>
              <div><dt>Tipo</dt><dd>{tarjetaSeleccionada.tipo}</dd></div>
              <div><dt>Número</dt><dd>{tarjetaSeleccionada.numeroMasked}</dd></div>
              <div><dt>Estado</dt><dd>{estadoAccesible(tarjetaSeleccionada.estado)}</dd></div>
              <div><dt>Saldo</dt><dd>{formatearMoneda(tarjetaSeleccionada.saldo)}</dd></div>
            </dl>
          )}
        </section>
      )}
    </main>
  );
}
