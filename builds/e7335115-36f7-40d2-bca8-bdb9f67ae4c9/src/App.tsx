import { useMemo, useState } from 'react';

type EstadoTarjeta = 'Activa' | 'Bloqueada';

interface Tarjeta {
  id: string;
  alias: string;
  titular: string;
  numeroEnmascarado: string;
  tipo: 'Débito' | 'Crédito';
  saldoDisponible: number;
  limite: number;
  estado: EstadoTarjeta;
}

const TARJETAS_INICIALES: Tarjeta[] = [
  {
    id: 'tj-001',
    alias: 'Tarjeta Nómina',
    titular: 'María Fernanda Ríos',
    numeroEnmascarado: '**** **** **** 4821',
    tipo: 'Débito',
    saldoDisponible: 4_250_300,
    limite: 6_000_000,
    estado: 'Activa',
  },
  {
    id: 'tj-002',
    alias: 'Tarjeta Viajes',
    titular: 'María Fernanda Ríos',
    numeroEnmascarado: '**** **** **** 1190',
    tipo: 'Crédito',
    saldoDisponible: 1_820_000,
    limite: 5_000_000,
    estado: 'Activa',
  },
  {
    id: 'tj-003',
    alias: 'Tarjeta Respaldo',
    titular: 'Jorge Andrés Peña',
    numeroEnmascarado: '**** **** **** 7733',
    tipo: 'Crédito',
    saldoDisponible: 0,
    limite: 3_000_000,
    estado: 'Bloqueada',
  },
];

const formatoMoneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export default function App() {
  const [capacidadProbada, setCapacidadProbada] = useState(false);
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>(TARJETAS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [idSeleccionada, setIdSeleccionada] = useState<string | null>(TARJETAS_INICIALES[0]?.id ?? null);
  const [idPendienteConfirmar, setIdPendienteConfirmar] = useState<string | null>(null);
  const [mensajeAccion, setMensajeAccion] = useState('');

  const tarjetasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return tarjetas;
    return tarjetas.filter((tarjeta) =>
      [tarjeta.alias, tarjeta.titular, tarjeta.numeroEnmascarado, tarjeta.tipo, tarjeta.estado]
        .join(' ')
        .toLowerCase()
        .includes(termino),
    );
  }, [tarjetas, busqueda]);

  const tarjetaSeleccionada = useMemo(
    () => tarjetas.find((tarjeta) => tarjeta.id === idSeleccionada) ?? null,
    [tarjetas, idSeleccionada],
  );

  const tarjetaPendiente = useMemo(
    () => tarjetas.find((tarjeta) => tarjeta.id === idPendienteConfirmar) ?? null,
    [tarjetas, idPendienteConfirmar],
  );

  function pedirCambioEstado(id: string) {
    setIdPendienteConfirmar(id);
    setMensajeAccion('');
  }

  function cancelarCambioEstado() {
    setIdPendienteConfirmar(null);
  }

  function confirmarCambioEstado() {
    if (!tarjetaPendiente) return;
    const nuevoEstado: EstadoTarjeta = tarjetaPendiente.estado === 'Activa' ? 'Bloqueada' : 'Activa';
    setTarjetas((previas) =>
      previas.map((tarjeta) =>
        tarjeta.id === tarjetaPendiente.id ? { ...tarjeta, estado: nuevoEstado } : tarjeta,
      ),
    );
    setMensajeAccion(
      `${tarjetaPendiente.alias} ahora está ${nuevoEstado === 'Activa' ? 'activa' : 'bloqueada'}.`,
    );
    setIdPendienteConfirmar(null);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__texto">
          <p className="app-header__eyebrow">Banca por Internet · Tarjetas</p>
          <h1>Consulta de Tarjetas</h1>
          <p className="app-header__descripcion">
            Revisa tus tarjetas, busca por alias o titular y gestiona el bloqueo o desbloqueo con
            confirmación. Datos de demostración en memoria.
          </p>
        </div>
        <button
          type="button"
          className="boton boton--primario"
          onClick={() => setCapacidadProbada(true)}
        >
          Probar capacidad
        </button>
      </header>

      <p role="status" aria-live="polite" className="estado-capacidad">
        {capacidadProbada ? 'Consulta de Tarjetas' : ''}
      </p>

      <main className="app-contenido">
        <section className="panel" aria-labelledby="titulo-buscador">
          <h2 id="titulo-buscador">Buscar tarjetas</h2>
          <label htmlFor="busqueda-tarjetas" className="etiqueta">
            Alias, titular, tipo o estado
          </label>
          <input
            id="busqueda-tarjetas"
            type="search"
            className="campo-texto"
            placeholder="Ej: Viajes, Jorge, Crédito, Bloqueada"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />

          <ul className="lista-tarjetas" aria-label="Resultados de tarjetas">
            {tarjetasFiltradas.length === 0 && (
              <li className="lista-tarjetas__vacio">No hay tarjetas que coincidan con la búsqueda.</li>
            )}
            {tarjetasFiltradas.map((tarjeta) => (
              <li key={tarjeta.id}>
                <button
                  type="button"
                  className={
                    'tarjeta-item' + (tarjeta.id === idSeleccionada ? ' tarjeta-item--activa' : '')
                  }
                  onClick={() => setIdSeleccionada(tarjeta.id)}
                  aria-pressed={tarjeta.id === idSeleccionada}
                >
                  <span className="tarjeta-item__alias">{tarjeta.alias}</span>
                  <span className="tarjeta-item__numero">{tarjeta.numeroEnmascarado}</span>
                  <span
                    className={
                      'badge ' +
                      (tarjeta.estado === 'Activa' ? 'badge--exito' : 'badge--peligro')
                    }
                  >
                    {tarjeta.estado}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel" aria-labelledby="titulo-detalle">
          <h2 id="titulo-detalle">Detalle de la tarjeta</h2>
          {!tarjetaSeleccionada && <p className="texto-muted">Selecciona una tarjeta para ver su detalle.</p>}
          {tarjetaSeleccionada && (
            <div className="detalle-tarjeta">
              <dl className="detalle-tarjeta__grid">
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
                    <span
                      className={
                        'badge ' +
                        (tarjetaSeleccionada.estado === 'Activa' ? 'badge--exito' : 'badge--peligro')
                      }
                    >
                      {tarjetaSeleccionada.estado}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Saldo disponible</dt>
                  <dd className="valor-numerico">{formatoMoneda.format(tarjetaSeleccionada.saldoDisponible)}</dd>
                </div>
                <div>
                  <dt>Límite</dt>
                  <dd className="valor-numerico">{formatoMoneda.format(tarjetaSeleccionada.limite)}</dd>
                </div>
              </dl>

              {idPendienteConfirmar === tarjetaSeleccionada.id ? (
                <div className="confirmacion" role="alertdialog" aria-labelledby="titulo-confirmacion">
                  <p id="titulo-confirmacion">
                    ¿Confirmas {tarjetaSeleccionada.estado === 'Activa' ? 'bloquear' : 'desbloquear'}{' '}
                    {tarjetaSeleccionada.alias}?
                  </p>
                  <div className="confirmacion__acciones">
                    <button type="button" className="boton boton--peligro" onClick={confirmarCambioEstado}>
                      Sí, confirmar
                    </button>
                    <button type="button" className="boton boton--secundario" onClick={cancelarCambioEstado}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className={
                    'boton ' +
                    (tarjetaSeleccionada.estado === 'Activa' ? 'boton--peligro' : 'boton--primario')
                  }
                  onClick={() => pedirCambioEstado(tarjetaSeleccionada.id)}
                >
                  {tarjetaSeleccionada.estado === 'Activa' ? 'Bloquear tarjeta' : 'Desbloquear tarjeta'}
                </button>
              )}
            </div>
          )}

          <p role="status" aria-live="polite" className="mensaje-accion">
            {mensajeAccion}
          </p>
        </section>
      </main>
    </div>
  );
}
