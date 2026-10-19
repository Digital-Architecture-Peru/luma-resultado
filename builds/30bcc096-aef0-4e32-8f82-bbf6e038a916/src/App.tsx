import { useMemo, useState } from 'react';

type Tarjeta = {
  id: string;
  alias: string;
  numeroEnmascarado: string;
  saldoDisponible: number;
};

type TipoTransaccion = 'Compra' | 'Pago' | 'Retiro';

type Transaccion = {
  id: string;
  tarjetaId: string;
  tipo: TipoTransaccion;
  monto: number;
  descripcion: string;
  fecha: string;
};

const TARJETAS_INICIALES: Tarjeta[] = [
  { id: 't1', alias: 'Clásica', numeroEnmascarado: '**** 4821', saldoDisponible: 3_250_000 },
  { id: 't2', alias: 'Gold', numeroEnmascarado: '**** 1190', saldoDisponible: 7_800_000 },
  { id: 't3', alias: 'Empresarial', numeroEnmascarado: '**** 6654', saldoDisponible: 1_420_000 },
];

const TRANSACCIONES_INICIALES: Transaccion[] = [
  { id: 'x1', tarjetaId: 't1', tipo: 'Compra', monto: 85000, descripcion: 'Supermercado La 14', fecha: '2026-10-15' },
  { id: 'x2', tarjetaId: 't2', tipo: 'Pago', monto: 500000, descripcion: 'Pago mínimo', fecha: '2026-10-12' },
];

const formatoCOP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

function generarId(prefijo: string): string {
  return `${prefijo}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export default function App() {
  const [tarjetas] = useState<Tarjeta[]>(TARJETAS_INICIALES);
  const [transacciones, setTransacciones] = useState<Transaccion[]>(TRANSACCIONES_INICIALES);

  const [tarjetaId, setTarjetaId] = useState(TARJETAS_INICIALES[0].id);
  const [tipo, setTipo] = useState<TipoTransaccion>('Compra');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);
  const [mensajeCreacion, setMensajeCreacion] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'Todas' | TipoTransaccion>('Todas');

  const [idPorEliminar, setIdPorEliminar] = useState<string | null>(null);
  const [mensajeEliminacion, setMensajeEliminacion] = useState<string | null>(null);

  const [mensajeCapacidad, setMensajeCapacidad] = useState<string | null>(null);

  const tarjetasPorId = useMemo(() => {
    const mapa = new Map<string, Tarjeta>();
    for (const t of tarjetas) mapa.set(t.id, t);
    return mapa;
  }, [tarjetas]);

  const transaccionesFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return transacciones
      .filter((tx) => (filtroTipo === 'Todas' ? true : tx.tipo === filtroTipo))
      .filter((tx) => {
        if (!texto) return true;
        const tarjeta = tarjetasPorId.get(tx.tarjetaId);
        return (
          tx.descripcion.toLowerCase().includes(texto) ||
          tarjeta?.alias.toLowerCase().includes(texto) ||
          tarjeta?.numeroEnmascarado.toLowerCase().includes(texto)
        );
      })
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, [transacciones, busqueda, filtroTipo, tarjetasPorId]);

  function manejarCreacion(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const montoNumerico = Number(monto);

    if (!tarjetaId) {
      setErrorFormulario('Selecciona una tarjeta.');
      setMensajeCreacion(null);
      return;
    }
    if (!monto || Number.isNaN(montoNumerico) || montoNumerico <= 0) {
      setErrorFormulario('Ingresa un monto válido mayor a cero.');
      setMensajeCreacion(null);
      return;
    }
    if (!descripcion.trim()) {
      setErrorFormulario('Ingresa una descripción.');
      setMensajeCreacion(null);
      return;
    }

    const tarjeta = tarjetasPorId.get(tarjetaId);
    if (tipo !== 'Pago' && tarjeta && montoNumerico > tarjeta.saldoDisponible) {
      setErrorFormulario('El monto supera el saldo disponible de la tarjeta.');
      setMensajeCreacion(null);
      return;
    }

    const nuevaTransaccion: Transaccion = {
      id: generarId('tx'),
      tarjetaId,
      tipo,
      monto: montoNumerico,
      descripcion: descripcion.trim(),
      fecha: new Date().toISOString().slice(0, 10),
    };

    setTransacciones((actuales) => [nuevaTransaccion, ...actuales]);
    setErrorFormulario(null);
    setMensajeCreacion(`Transacción de ${tipo.toLowerCase()} registrada por ${formatoCOP.format(montoNumerico)}.`);
    setMonto('');
    setDescripcion('');
  }

  function solicitarEliminacion(id: string) {
    setIdPorEliminar(id);
    setMensajeEliminacion(null);
  }

  function cancelarEliminacion() {
    setIdPorEliminar(null);
  }

  function confirmarEliminacion() {
    if (!idPorEliminar) return;
    setTransacciones((actuales) => actuales.filter((tx) => tx.id !== idPorEliminar));
    setMensajeEliminacion('Transacción eliminada correctamente.');
    setIdPorEliminar(null);
  }

  function probarCapacidad() {
    setMensajeCapacidad('Transacción de Tarjetas');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Banca por Internet · Tarjetas</p>
        <h1>Transacción de Tarjetas</h1>
        <p className="descripcion">
          Registra, busca y elimina transacciones ficticias sobre tus tarjetas, con saldo validado en memoria.
        </p>
        <div className="capacidad-demo">
          <button type="button" className="boton boton-primario" onClick={probarCapacidad}>
            Probar capacidad
          </button>
          <p role="status" className="mensaje-estado" aria-live="polite">
            {mensajeCapacidad}
          </p>
        </div>
      </header>

      <section className="panel" aria-labelledby="titulo-tarjetas">
        <h2 id="titulo-tarjetas">Tarjetas</h2>
        <div className="grid-tarjetas">
          {tarjetas.map((t) => (
            <article key={t.id} className="tarjeta-card">
              <h3>{t.alias}</h3>
              <p className="numero">{t.numeroEnmascarado}</p>
              <p className="saldo">
                Saldo disponible <strong>{formatoCOP.format(t.saldoDisponible)}</strong>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel" aria-labelledby="titulo-nueva">
        <h2 id="titulo-nueva">Nueva transacción</h2>
        <form className="formulario" onSubmit={manejarCreacion} noValidate>
          <div className="campo">
            <label htmlFor="campo-tarjeta">Tarjeta</label>
            <select id="campo-tarjeta" value={tarjetaId} onChange={(e) => setTarjetaId(e.target.value)}>
              {tarjetas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.alias} · {t.numeroEnmascarado}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="campo-tipo">Tipo</label>
            <select id="campo-tipo" value={tipo} onChange={(e) => setTipo(e.target.value as TipoTransaccion)}>
              <option value="Compra">Compra</option>
              <option value="Pago">Pago</option>
              <option value="Retiro">Retiro</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="campo-monto">Monto (COP)</label>
            <input
              id="campo-monto"
              type="number"
              inputMode="numeric"
              min={1}
              step={1000}
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ej. 150000"
            />
          </div>

          <div className="campo campo-ancho">
            <label htmlFor="campo-descripcion">Descripción</label>
            <input
              id="campo-descripcion"
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej. Pago de servicios"
            />
          </div>

          <div className="acciones-formulario">
            <button type="submit" className="boton boton-primario">
              Registrar transacción
            </button>
          </div>

          <p role="status" aria-live="polite" className="mensaje-formulario">
            {errorFormulario ? <span className="texto-error">{errorFormulario}</span> : mensajeCreacion}
          </p>
        </form>
      </section>

      <section className="panel" aria-labelledby="titulo-historial">
        <h2 id="titulo-historial">Historial de transacciones</h2>

        <div className="controles-busqueda">
          <div className="campo">
            <label htmlFor="campo-busqueda">Buscar</label>
            <input
              id="campo-busqueda"
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Descripción, alias o número de tarjeta"
            />
          </div>
          <div className="campo">
            <label htmlFor="campo-filtro-tipo">Filtrar por tipo</label>
            <select
              id="campo-filtro-tipo"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as 'Todas' | TipoTransaccion)}
            >
              <option value="Todas">Todas</option>
              <option value="Compra">Compra</option>
              <option value="Pago">Pago</option>
              <option value="Retiro">Retiro</option>
            </select>
          </div>
        </div>

        <p role="status" aria-live="polite" className="mensaje-formulario">
          {mensajeEliminacion}
        </p>

        {transaccionesFiltradas.length === 0 ? (
          <p className="estado-vacio">No hay transacciones que coincidan con la búsqueda.</p>
        ) : (
          <div className="tabla-contenedor">
            <table className="tabla-transacciones">
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Tarjeta</th>
                  <th scope="col">Tipo</th>
                  <th scope="col" className="columna-numerica">Monto</th>
                  <th scope="col">Descripción</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {transaccionesFiltradas.map((tx) => {
                  const tarjeta = tarjetasPorId.get(tx.tarjetaId);
                  return (
                    <tr key={tx.id}>
                      <td>{tx.fecha}</td>
                      <td>{tarjeta ? `${tarjeta.alias} · ${tarjeta.numeroEnmascarado}` : 'N/D'}</td>
                      <td>
                        <span className={`insignia insignia-${tx.tipo.toLowerCase()}`}>{tx.tipo}</span>
                      </td>
                      <td className="columna-numerica">{formatoCOP.format(tx.monto)}</td>
                      <td>{tx.descripcion}</td>
                      <td>
                        {idPorEliminar === tx.id ? (
                          <div className="confirmacion-inline">
                            <span>¿Eliminar?</span>
                            <button type="button" className="boton boton-peligro" onClick={confirmarEliminacion}>
                              Confirmar
                            </button>
                            <button type="button" className="boton boton-fantasma" onClick={cancelarEliminacion}>
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="boton boton-secundario"
                            onClick={() => solicitarEliminacion(tx.id)}
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
