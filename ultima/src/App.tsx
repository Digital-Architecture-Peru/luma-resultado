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
  vencimiento: string;
}

const TARJETAS_INICIALES: Tarjeta[] = [
  {
    id: 'TC-1001',
    titular: 'María Fernanda Ríos',
    numeroEnmascarado: '**** **** **** 4821',
    tipo: 'Crédito',
    estado: 'Activa',
    saldoDisponible: 3250000,
    limite: 5000000,
    vencimiento: '08/2028',
  },
  {
    id: 'TC-1002',
    titular: 'Juan Camilo Torres',
    numeroEnmascarado: '**** **** **** 1190',
    tipo: 'Débito',
    estado: 'Activa',
    saldoDisponible: 980000,
    limite: 980000,
    vencimiento: '03/2027',
  },
  {
    id: 'TC-1003',
    titular: 'Laura Patricia Gómez',
    numeroEnmascarado: '**** **** **** 7734',
    tipo: 'Crédito',
    estado: 'Bloqueada',
    saldoDisponible: 0,
    limite: 4000000,
    vencimiento: '11/2026',
  },
  {
    id: 'TC-1004',
    titular: 'Andrés Felipe Suárez',
    numeroEnmascarado: '**** **** **** 2290',
    tipo: 'Débito',
    estado: 'Vencida',
    saldoDisponible: 0,
    limite: 1200000,
    vencimiento: '01/2025',
  },
];

const formatoMoneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

function badgeClasePorEstado(estado: EstadoTarjeta): string {
  if (estado === 'Activa') return 'badge badge--success';
  if (estado === 'Bloqueada') return 'badge badge--danger';
  return 'badge badge--muted';
}

export default function App() {
  const [tarjetas] = useState<Tarjeta[]>(TARJETAS_INICIALES);
  const [consulta, setConsulta] = useState('');
  const [tarjetaSeleccionadaId, setTarjetaSeleccionadaId] = useState<string | null>(null);
  const [confirmandoBloqueoId, setConfirmandoBloqueoId] = useState<string | null>(null);
  const [mensajeAccion, setMensajeAccion] = useState('');
  const [estadoCapacidad, setEstadoCapacidad] = useState('');

  const tarjetasFiltradas = useMemo(() => {
    const termino = consulta.trim().toLowerCase();
    if (!termino) return tarjetas;
    return tarjetas.filter((t) =>
      t.titular.toLowerCase().includes(termino) ||
      t.id.toLowerCase().includes(termino) ||
      t.numeroEnmascarado.toLowerCase().includes(termino)
    );
  }, [consulta, tarjetas]);

  const tarjetaSeleccionada = useMemo(
    () => tarjetas.find((t) => t.id === tarjetaSeleccionadaId) ?? null,
    [tarjetas, tarjetaSeleccionadaId]
  );

  function manejarProbarCapacidad() {
    setEstadoCapacidad('Consulta de Tarjetas');
  }

  function manejarVerDetalle(id: string) {
    setTarjetaSeleccionadaId(id);
    setConfirmandoBloqueoId(null);
    setMensajeAccion('');
  }

  function manejarPedirConfirmacionBloqueo(id: string) {
    setConfirmandoBloqueoId(id);
    setMensajeAccion('');
  }

  function manejarCancelarConfirmacion() {
    setConfirmandoBloqueoId(null);
  }

  function manejarConfirmarBloqueo(id: string) {
    const tarjeta = tarjetas.find((t) => t.id === id);
    setConfirmandoBloqueoId(null);
    setMensajeAccion(
      tarjeta
        ? `Solicitud de bloqueo registrada para ${tarjeta.numeroEnmascarado} (simulado, sin persistencia).`
        : 'Solicitud de bloqueo registrada (simulado, sin persistencia).'
    );
  }

  return (
    <main className="layout">
      <header className="layout__header">
        <p className="eyebrow">Banca por Internet · Tarjetas</p>
        <h1>Consulta de Tarjetas</h1>
        <p className="subtitle">
          Revisa el estado y el detalle de tus tarjetas. Datos ficticios en memoria, sin conexión
          a sistemas reales.
        </p>
        <div className="probar-capacidad">
          <button type="button" className="btn btn--primary" onClick={manejarProbarCapacidad}>
            Probar capacidad
          </button>
          <p role="status" className="estado-capacidad">
            {estadoCapacidad}
          </p>
        </div>
      </header>

      <section className="panel" aria-labelledby="buscar-titulo">
        <h2 id="buscar-titulo" className="panel__titulo">
          Buscar tarjetas
        </h2>
        <label htmlFor="busqueda-tarjetas" className="campo__etiqueta">
          Titular, número o identificador
        </label>
        <input
          id="busqueda-tarjetas"
          type="search"
          className="campo__input"
          placeholder="Ej: Ríos, TC-1001, 4821"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          autoComplete="off"
        />

        {tarjetasFiltradas.length === 0 ? (
          <p className="estado-vacio">No se encontraron tarjetas para "{consulta}".</p>
        ) : (
          <div className="tabla-contenedor" role="region" aria-label="Resultados de la búsqueda">
            <table className="tabla">
              <thead>
                <tr>
                  <th scope="col">Titular</th>
                  <th scope="col">Número</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Disponible</th>
                  <th scope="col">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tarjetasFiltradas.map((t) => (
                  <tr key={t.id} className={t.id === tarjetaSeleccionadaId ? 'fila--activa' : ''}>
                    <td>{t.titular}</td>
                    <td className="num">{t.numeroEnmascarado}</td>
                    <td>{t.tipo}</td>
                    <td>
                      <span className={badgeClasePorEstado(t.estado)}>{t.estado}</span>
                    </td>
                    <td className="num">{formatoMoneda.format(t.saldoDisponible)}</td>
                    <td className="celda-acciones">
                      <button
                        type="button"
                        className="btn btn--secundario btn--chico"
                        onClick={() => manejarVerDetalle(t.id)}
                      >
                        Ver detalle
                      </button>
                      <button
                        type="button"
                        className="btn btn--peligro btn--chico"
                        disabled={t.estado === 'Bloqueada'}
                        onClick={() => manejarPedirConfirmacionBloqueo(t.id)}
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

      {tarjetaSeleccionada && (
        <section className="panel" aria-labelledby="detalle-titulo">
          <h2 id="detalle-titulo" className="panel__titulo">
            Detalle de {tarjetaSeleccionada.titular}
          </h2>
          <dl className="detalle-grid">
            <div className="detalle-item">
              <dt>Identificador</dt>
              <dd>{tarjetaSeleccionada.id}</dd>
            </div>
            <div className="detalle-item">
              <dt>Número</dt>
              <dd className="num">{tarjetaSeleccionada.numeroEnmascarado}</dd>
            </div>
            <div className="detalle-item">
              <dt>Tipo</dt>
              <dd>{tarjetaSeleccionada.tipo}</dd>
            </div>
            <div className="detalle-item">
              <dt>Estado</dt>
              <dd>
                <span className={badgeClasePorEstado(tarjetaSeleccionada.estado)}>
                  {tarjetaSeleccionada.estado}
                </span>
              </dd>
            </div>
            <div className="detalle-item">
              <dt>Disponible</dt>
              <dd className="num">{formatoMoneda.format(tarjetaSeleccionada.saldoDisponible)}</dd>
            </div>
            <div className="detalle-item">
              <dt>Límite</dt>
              <dd className="num">{formatoMoneda.format(tarjetaSeleccionada.limite)}</dd>
            </div>
            <div className="detalle-item">
              <dt>Vencimiento</dt>
              <dd>{tarjetaSeleccionada.vencimiento}</dd>
            </div>
          </dl>
        </section>
      )}

      {confirmandoBloqueoId && (
        <section className="panel panel--confirmacion" aria-labelledby="confirmar-titulo">
          <h2 id="confirmar-titulo" className="panel__titulo">
            Confirmar bloqueo
          </h2>
          <p>
            ¿Confirmas el bloqueo de la tarjeta{' '}
            <strong>
              {tarjetas.find((t) => t.id === confirmandoBloqueoId)?.numeroEnmascarado}
            </strong>
            ? Esta acción es simulada y no persiste.
          </p>
          <div className="acciones-confirmacion">
            <button
              type="button"
              className="btn btn--peligro"
              onClick={() => manejarConfirmarBloqueo(confirmandoBloqueoId)}
            >
              Sí, bloquear
            </button>
            <button type="button" className="btn btn--secundario" onClick={manejarCancelarConfirmacion}>
              Cancelar
            </button>
          </div>
        </section>
      )}

      <p role="status" className="mensaje-accion">
        {mensajeAccion}
      </p>
    </main>
  );
}
