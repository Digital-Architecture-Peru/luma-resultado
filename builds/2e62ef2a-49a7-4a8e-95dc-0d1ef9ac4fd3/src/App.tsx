import { useMemo, useState } from 'react';

type EstadoTarjeta = 'Activa' | 'Bloqueada' | 'Vencida';

interface Tarjeta {
  id: string;
  titular: string;
  numeroEnmascarado: string;
  tipo: 'Débito' | 'Crédito';
  estado: EstadoTarjeta;
  saldoDisponible: number;
  limite: number;
  ultimoMovimiento: string;
}

const TARJETAS_INICIALES: Tarjeta[] = [
  {
    id: 'tj-1001',
    titular: 'María Fernanda Londoño',
    numeroEnmascarado: '**** **** **** 4821',
    tipo: 'Crédito',
    estado: 'Activa',
    saldoDisponible: 3250000,
    limite: 5000000,
    ultimoMovimiento: '2026-10-05',
  },
  {
    id: 'tj-1002',
    titular: 'Carlos Andrés Pérez',
    numeroEnmascarado: '**** **** **** 1190',
    tipo: 'Débito',
    estado: 'Activa',
    saldoDisponible: 980000,
    limite: 980000,
    ultimoMovimiento: '2026-10-06',
  },
  {
    id: 'tj-1003',
    titular: 'Luisa Fernanda Rojas',
    numeroEnmascarado: '**** **** **** 7734',
    tipo: 'Crédito',
    estado: 'Bloqueada',
    saldoDisponible: 0,
    limite: 2000000,
    ultimoMovimiento: '2026-09-28',
  },
  {
    id: 'tj-1004',
    titular: 'Jorge Iván Martínez',
    numeroEnmascarado: '**** **** **** 2290',
    tipo: 'Débito',
    estado: 'Vencida',
    saldoDisponible: 0,
    limite: 450000,
    ultimoMovimiento: '2026-07-14',
  },
  {
    id: 'tj-1005',
    titular: 'Ana Sofía Gutiérrez',
    numeroEnmascarado: '**** **** **** 6603',
    tipo: 'Crédito',
    estado: 'Activa',
    saldoDisponible: 7120000,
    limite: 9000000,
    ultimoMovimiento: '2026-10-07',
  },
];

const formatoMoneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

function formatearFecha(fechaIso: string): string {
  const fecha = new Date(`${fechaIso}T00:00:00`);
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(fecha);
}

type FiltroEstado = 'Todas' | EstadoTarjeta;

export default function App() {
  const [tarjetas] = useState<Tarjeta[]>(TARJETAS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('Todas');
  const [tarjetaSeleccionadaId, setTarjetaSeleccionadaId] = useState<string | null>(null);
  const [confirmandoBloqueoId, setConfirmandoBloqueoId] = useState<string | null>(null);
  const [mensajeAccion, setMensajeAccion] = useState('');
  const [capacidadProbada, setCapacidadProbada] = useState(false);

  const tarjetasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return tarjetas.filter((tarjeta) => {
      const coincideBusqueda =
        termino.length === 0 ||
        tarjeta.titular.toLowerCase().includes(termino) ||
        tarjeta.numeroEnmascarado.toLowerCase().includes(termino) ||
        tarjeta.id.toLowerCase().includes(termino);
      const coincideEstado = filtroEstado === 'Todas' || tarjeta.estado === filtroEstado;
      return coincideBusqueda && coincideEstado;
    });
  }, [tarjetas, busqueda, filtroEstado]);

  const tarjetaSeleccionada = tarjetas.find((tarjeta) => tarjeta.id === tarjetaSeleccionadaId) ?? null;

  function manejarProbarCapacidad() {
    setCapacidadProbada(true);
  }

  function manejarSolicitarBloqueo(id: string) {
    setConfirmandoBloqueoId(id);
    setMensajeAccion('');
  }

  function manejarCancelarBloqueo() {
    setConfirmandoBloqueoId(null);
  }

  function manejarConfirmarBloqueo(tarjeta: Tarjeta) {
    setConfirmandoBloqueoId(null);
    setMensajeAccion(`Solicitud de bloqueo simulada para la tarjeta ${tarjeta.numeroEnmascarado} de ${tarjeta.titular}.`);
  }

  return (
    <main className="pagina">
      <header className="encabezado">
        <p className="eyebrow">Banca por Internet</p>
        <h1>Consulta de Tarjetas</h1>
        <p className="subtitulo">Revisa el estado, saldo y movimientos recientes de las tarjetas asociadas.</p>
        <button type="button" className="boton boton-primario" onClick={manejarProbarCapacidad}>
          Probar capacidad
        </button>
        <p role="status" className="estado-capacidad">
          {capacidadProbada ? 'Consulta de Tarjetas' : ''}
        </p>
      </header>

      <section className="panel" aria-labelledby="titulo-filtros">
        <h2 id="titulo-filtros" className="titulo-seccion">
          Buscar y filtrar
        </h2>
        <div className="controles">
          <div className="campo">
            <label htmlFor="campo-busqueda">Buscar por titular, número o ID</label>
            <input
              id="campo-busqueda"
              type="search"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Ej. María, 4821, tj-1001"
              autoComplete="off"
            />
          </div>
          <div className="campo">
            <label htmlFor="campo-estado">Estado</label>
            <select
              id="campo-estado"
              value={filtroEstado}
              onChange={(evento) => setFiltroEstado(evento.target.value as FiltroEstado)}
            >
              <option value="Todas">Todas</option>
              <option value="Activa">Activa</option>
              <option value="Bloqueada">Bloqueada</option>
              <option value="Vencida">Vencida</option>
            </select>
          </div>
        </div>
        <p className="resultado-conteo" aria-live="polite">
          {tarjetasFiltradas.length} {tarjetasFiltradas.length === 1 ? 'tarjeta encontrada' : 'tarjetas encontradas'}
        </p>
      </section>

      <section className="panel" aria-labelledby="titulo-listado">
        <h2 id="titulo-listado" className="titulo-seccion">
          Tarjetas
        </h2>
        {tarjetasFiltradas.length === 0 ? (
          <p className="estado-vacio">No hay tarjetas que coincidan con la búsqueda o el filtro aplicado.</p>
        ) : (
          <div className="tabla-contenedor">
            <table className="tabla-tarjetas">
              <thead>
                <tr>
                  <th scope="col">Titular</th>
                  <th scope="col">Número</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className="columna-numerica">
                    Saldo disponible
                  </th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tarjetasFiltradas.map((tarjeta) => (
                  <tr key={tarjeta.id}>
                    <td>{tarjeta.titular}</td>
                    <td>{tarjeta.numeroEnmascarado}</td>
                    <td>{tarjeta.tipo}</td>
                    <td>
                      <span className={`insignia insignia-${tarjeta.estado.toLowerCase()}`}>{tarjeta.estado}</span>
                    </td>
                    <td className="columna-numerica">{formatoMoneda.format(tarjeta.saldoDisponible)}</td>
                    <td className="celda-acciones">
                      <button
                        type="button"
                        className="boton boton-secundario"
                        onClick={() => setTarjetaSeleccionadaId(tarjeta.id)}
                      >
                        Ver detalle
                      </button>
                      <button
                        type="button"
                        className="boton boton-peligro"
                        onClick={() => manejarSolicitarBloqueo(tarjeta.id)}
                        disabled={tarjeta.estado === 'Bloqueada'}
                      >
                        Bloquear
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {mensajeAccion && (
        <p role="status" className="mensaje-accion">
          {mensajeAccion}
        </p>
      )}

      {tarjetaSeleccionada && (
        <section className="panel panel-detalle" aria-labelledby="titulo-detalle">
          <div className="detalle-encabezado">
            <h2 id="titulo-detalle" className="titulo-seccion">
              Detalle de la tarjeta
            </h2>
            <button type="button" className="boton boton-fantasma" onClick={() => setTarjetaSeleccionadaId(null)}>
              Cerrar
            </button>
          </div>
          <dl className="lista-detalle">
            <div className="fila-detalle">
              <dt>Titular</dt>
              <dd>{tarjetaSeleccionada.titular}</dd>
            </div>
            <div className="fila-detalle">
              <dt>Número</dt>
              <dd>{tarjetaSeleccionada.numeroEnmascarado}</dd>
            </div>
            <div className="fila-detalle">
              <dt>Tipo</dt>
              <dd>{tarjetaSeleccionada.tipo}</dd>
            </div>
            <div className="fila-detalle">
              <dt>Estado</dt>
              <dd>{tarjetaSeleccionada.estado}</dd>
            </div>
            <div className="fila-detalle">
              <dt>Saldo disponible</dt>
              <dd>{formatoMoneda.format(tarjetaSeleccionada.saldoDisponible)}</dd>
            </div>
            <div className="fila-detalle">
              <dt>Límite</dt>
              <dd>{formatoMoneda.format(tarjetaSeleccionada.limite)}</dd>
            </div>
            <div className="fila-detalle">
              <dt>Último movimiento</dt>
              <dd>{formatearFecha(tarjetaSeleccionada.ultimoMovimiento)}</dd>
            </div>
          </dl>
        </section>
      )}

      {confirmandoBloqueoId && (
        <div className="superposicion" role="presentation">
          <div className="dialogo" role="alertdialog" aria-modal="true" aria-labelledby="titulo-confirmacion">
            <h2 id="titulo-confirmacion">Confirmar bloqueo</h2>
            <p>
              ¿Confirmas el bloqueo simulado de la tarjeta{' '}
              {tarjetas.find((t) => t.id === confirmandoBloqueoId)?.numeroEnmascarado}? Esta acción es ficticia y no
              afecta datos reales.
            </p>
            <div className="dialogo-acciones">
              <button type="button" className="boton boton-fantasma" onClick={manejarCancelarBloqueo}>
                Cancelar
              </button>
              <button
                type="button"
                className="boton boton-peligro"
                onClick={() => {
                  const tarjeta = tarjetas.find((t) => t.id === confirmandoBloqueoId);
                  if (tarjeta) manejarConfirmarBloqueo(tarjeta);
                }}
              >
                Confirmar bloqueo
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
