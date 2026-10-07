import { useMemo, useState } from 'react';

type EstadoTarjeta = 'Activa' | 'Bloqueada' | 'Vencida';

interface Tarjeta {
  id: string;
  alias: string;
  titular: string;
  numeroEnmascarado: string;
  tipo: 'Crédito' | 'Débito';
  estado: EstadoTarjeta;
  saldoDisponible: number;
  limite: number;
  ultimoMovimiento: string;
}

const TARJETAS_INICIALES: Tarjeta[] = [
  {
    id: 'tj-1001',
    alias: 'Tarjeta Oro',
    titular: 'María Fernanda Ríos',
    numeroEnmascarado: '**** **** **** 4821',
    tipo: 'Crédito',
    estado: 'Activa',
    saldoDisponible: 5420000,
    limite: 8000000,
    ultimoMovimiento: '2026-10-02',
  },
  {
    id: 'tj-1002',
    alias: 'Débito Nómina',
    titular: 'Carlos Andrés Pardo',
    numeroEnmascarado: '**** **** **** 1190',
    tipo: 'Débito',
    estado: 'Activa',
    saldoDisponible: 1230500,
    limite: 1230500,
    ultimoMovimiento: '2026-10-05',
  },
  {
    id: 'tj-1003',
    alias: 'Tarjeta Platino',
    titular: 'Lucía Esperanza Gómez',
    numeroEnmascarado: '**** **** **** 7734',
    tipo: 'Crédito',
    estado: 'Bloqueada',
    saldoDisponible: 0,
    limite: 15000000,
    ultimoMovimiento: '2026-09-18',
  },
  {
    id: 'tj-1004',
    alias: 'Débito Ahorros',
    titular: 'Jorge Iván Salcedo',
    numeroEnmascarado: '**** **** **** 5560',
    tipo: 'Débito',
    estado: 'Vencida',
    saldoDisponible: 85000,
    limite: 85000,
    ultimoMovimiento: '2026-06-30',
  },
];

const formatoMoneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const formatoFecha = (iso: string) =>
  new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: 'short', day: '2-digit' }).format(
    new Date(`${iso}T00:00:00`),
  );

type FiltroEstado = 'Todas' | EstadoTarjeta;

function estadoBadgeClase(estado: EstadoTarjeta): string {
  switch (estado) {
    case 'Activa':
      return 'badge badge--exito';
    case 'Bloqueada':
      return 'badge badge--peligro';
    case 'Vencida':
      return 'badge badge--alerta';
    default:
      return 'badge';
  }
}

export default function App() {
  const [tarjetas] = useState<Tarjeta[]>(TARJETAS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('Todas');
  const [seleccionId, setSeleccionId] = useState<string | null>(null);
  const [mensajePrueba, setMensajePrueba] = useState<string | null>(null);

  const tarjetasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return tarjetas.filter((t) => {
      const coincideTexto =
        termino.length === 0 ||
        t.alias.toLowerCase().includes(termino) ||
        t.titular.toLowerCase().includes(termino) ||
        t.numeroEnmascarado.toLowerCase().includes(termino);
      const coincideEstado = filtroEstado === 'Todas' || t.estado === filtroEstado;
      return coincideTexto && coincideEstado;
    });
  }, [tarjetas, busqueda, filtroEstado]);

  const tarjetaSeleccionada = useMemo(
    () => tarjetas.find((t) => t.id === seleccionId) ?? null,
    [tarjetas, seleccionId],
  );

  const manejarProbarCapacidad = () => {
    setMensajePrueba('Consulta de Tarjetas: capacidad verificada con datos de ejemplo en memoria.');
  };

  return (
    <main className="app">
      <header className="app__header">
        <div className="app__header-texto">
          <p className="app__kicker">Banca por Internet · Micro-frontend</p>
          <h1 className="app__titulo">Consulta de Tarjetas</h1>
          <p className="app__subtitulo">
            Busca, filtra y revisa el detalle de las tarjetas asociadas al cliente. Datos ficticios en memoria,
            sin conexión a sistemas reales.
          </p>
        </div>
        <button
          type="button"
          className="boton boton--primario"
          onClick={manejarProbarCapacidad}
        >
          Probar capacidad
        </button>
      </header>

      <p role="status" aria-live="polite" className="estado-prueba">
        {mensajePrueba ?? ''}
      </p>

      <section className="panel" aria-labelledby="buscar-titulo">
        <h2 id="buscar-titulo" className="panel__titulo">
          Buscar tarjetas
        </h2>
        <div className="formulario-busqueda">
          <div className="campo">
            <label htmlFor="busqueda-input">Alias, titular o número</label>
            <input
              id="busqueda-input"
              type="search"
              placeholder="Ej. Tarjeta Oro, María Ríos, 4821"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="campo">
            <label htmlFor="estado-select">Estado</label>
            <select
              id="estado-select"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as FiltroEstado)}
            >
              <option value="Todas">Todas</option>
              <option value="Activa">Activa</option>
              <option value="Bloqueada">Bloqueada</option>
              <option value="Vencida">Vencida</option>
            </select>
          </div>
        </div>
      </section>

      <section className="panel" aria-labelledby="resultados-titulo">
        <div className="panel__encabezado">
          <h2 id="resultados-titulo" className="panel__titulo">
            Resultados
          </h2>
          <span className="contador" aria-live="polite">
            {tarjetasFiltradas.length} de {tarjetas.length} tarjetas
          </span>
        </div>

        {tarjetasFiltradas.length === 0 ? (
          <p className="estado-vacio">No se encontraron tarjetas con los criterios indicados.</p>
        ) : (
          <ul className="lista-tarjetas">
            {tarjetasFiltradas.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className={`tarjeta-card${seleccionId === t.id ? ' tarjeta-card--activa' : ''}`}
                  onClick={() => setSeleccionId(t.id)}
                  aria-pressed={seleccionId === t.id}
                >
                  <div className="tarjeta-card__fila">
                    <span className="tarjeta-card__alias">{t.alias}</span>
                    <span className={estadoBadgeClase(t.estado)}>{t.estado}</span>
                  </div>
                  <span className="tarjeta-card__numero">{t.numeroEnmascarado}</span>
                  <span className="tarjeta-card__titular">{t.titular}</span>
                  <span className="tarjeta-card__saldo">
                    Disponible: {formatoMoneda.format(t.saldoDisponible)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {tarjetaSeleccionada && (
        <section className="panel panel--detalle" aria-labelledby="detalle-titulo">
          <h2 id="detalle-titulo" className="panel__titulo">
            Detalle de {tarjetaSeleccionada.alias}
          </h2>
          <dl className="detalle-grid">
            <div className="detalle-item">
              <dt>Titular</dt>
              <dd>{tarjetaSeleccionada.titular}</dd>
            </div>
            <div className="detalle-item">
              <dt>Número</dt>
              <dd>{tarjetaSeleccionada.numeroEnmascarado}</dd>
            </div>
            <div className="detalle-item">
              <dt>Tipo</dt>
              <dd>{tarjetaSeleccionada.tipo}</dd>
            </div>
            <div className="detalle-item">
              <dt>Estado</dt>
              <dd>
                <span className={estadoBadgeClase(tarjetaSeleccionada.estado)}>
                  {tarjetaSeleccionada.estado}
                </span>
              </dd>
            </div>
            <div className="detalle-item">
              <dt>Saldo disponible</dt>
              <dd className="numero">{formatoMoneda.format(tarjetaSeleccionada.saldoDisponible)}</dd>
            </div>
            <div className="detalle-item">
              <dt>Límite</dt>
              <dd className="numero">{formatoMoneda.format(tarjetaSeleccionada.limite)}</dd>
            </div>
            <div className="detalle-item">
              <dt>Último movimiento</dt>
              <dd>{formatoFecha(tarjetaSeleccionada.ultimoMovimiento)}</dd>
            </div>
          </dl>
          <button
            type="button"
            className="boton boton--secundario"
            onClick={() => setSeleccionId(null)}
          >
            Cerrar detalle
          </button>
        </section>
      )}
    </main>
  );
}
