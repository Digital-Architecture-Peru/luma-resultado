import { useMemo, useState } from 'react';

type TipoTransaccion = 'Transferencia' | 'Depósito' | 'Retiro';
type EstadoTransaccion = 'Pendiente' | 'Confirmada' | 'Anulada';

interface Cuenta {
  id: string;
  alias: string;
  numero: string;
  saldo: number;
}

interface Transaccion {
  id: string;
  tipo: TipoTransaccion;
  cuentaOrigenId: string;
  cuentaDestinoId: string | null;
  monto: number;
  descripcion: string;
  estado: EstadoTransaccion;
  fecha: string;
}

const CUENTAS_INICIALES: Cuenta[] = [
  { id: 'c1', alias: 'Cuenta Corriente', numero: '001-2233-44', saldo: 4_500_000 },
  { id: 'c2', alias: 'Cuenta Ahorros', numero: '002-9981-10', saldo: 1_250_000 },
  { id: 'c3', alias: 'Cuenta Nómina', numero: '003-5567-72', saldo: 320_000 },
];

let correlativo = 1000;
function siguienteId(prefijo: string): string {
  correlativo += 1;
  return `${prefijo}-${correlativo}`;
}

function formatoMoneda(valor: number): string {
  return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}

function formatoFecha(iso: string): string {
  return new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function App() {
  const [cuentas, setCuentas] = useState<Cuenta[]>(CUENTAS_INICIALES);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);

  const [tipo, setTipo] = useState<TipoTransaccion>('Transferencia');
  const [cuentaOrigenId, setCuentaOrigenId] = useState<string>(CUENTAS_INICIALES[0].id);
  const [cuentaDestinoId, setCuentaDestinoId] = useState<string>(CUENTAS_INICIALES[1].id);
  const [monto, setMonto] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const [pendiente, setPendiente] = useState<Transaccion | null>(null);
  const [mensajeOperacion, setMensajeOperacion] = useState<string>('');

  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<'Todas' | EstadoTransaccion>('Todas');

  const [capacidadMensaje, setCapacidadMensaje] = useState<string>('');

  const cuentaPorId = useMemo(() => {
    const mapa = new Map<string, Cuenta>();
    cuentas.forEach((c) => mapa.set(c.id, c));
    return mapa;
  }, [cuentas]);

  const transaccionesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return transacciones
      .filter((t) => (filtroEstado === 'Todas' ? true : t.estado === filtroEstado))
      .filter((t) => {
        if (!termino) return true;
        const origen = cuentaPorId.get(t.cuentaOrigenId)?.alias ?? '';
        const destino = t.cuentaDestinoId ? cuentaPorId.get(t.cuentaDestinoId)?.alias ?? '' : '';
        return (
          t.descripcion.toLowerCase().includes(termino) ||
          origen.toLowerCase().includes(termino) ||
          destino.toLowerCase().includes(termino) ||
          t.tipo.toLowerCase().includes(termino)
        );
      })
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, [transacciones, busqueda, filtroEstado, cuentaPorId]);

  function validarFormulario(): string | null {
    const valor = Number(monto);
    if (!monto || Number.isNaN(valor) || valor <= 0) {
      return 'Ingresa un monto válido mayor a cero.';
    }
    if (tipo === 'Transferencia') {
      if (cuentaOrigenId === cuentaDestinoId) {
        return 'La cuenta origen y destino deben ser distintas.';
      }
      const origen = cuentaPorId.get(cuentaOrigenId);
      if (origen && valor > origen.saldo) {
        return 'Saldo insuficiente en la cuenta origen.';
      }
    }
    if (tipo === 'Retiro') {
      const origen = cuentaPorId.get(cuentaOrigenId);
      if (origen && valor > origen.saldo) {
        return 'Saldo insuficiente para el retiro.';
      }
    }
    if (!descripcion.trim()) {
      return 'Describe brevemente la transacción.';
    }
    return null;
  }

  function solicitarTransaccion(evento: React.FormEvent) {
    evento.preventDefault();
    const error = validarFormulario();
    if (error) {
      setFormError(error);
      setMensajeOperacion('');
      return;
    }
    setFormError(null);
    const nueva: Transaccion = {
      id: siguienteId('tx'),
      tipo,
      cuentaOrigenId,
      cuentaDestinoId: tipo === 'Transferencia' ? cuentaDestinoId : null,
      monto: Number(monto),
      descripcion: descripcion.trim(),
      estado: 'Pendiente',
      fecha: new Date().toISOString(),
    };
    setPendiente(nueva);
    setMensajeOperacion('Revisa los datos y confirma la transacción.');
  }

  function confirmarTransaccion() {
    if (!pendiente) return;
    setCuentas((previas) =>
      previas.map((c) => {
        if (c.id === pendiente.cuentaOrigenId) {
          return { ...c, saldo: c.saldo - pendiente.monto };
        }
        if (pendiente.cuentaDestinoId && c.id === pendiente.cuentaDestinoId) {
          return { ...c, saldo: c.saldo + pendiente.monto };
        }
        return c;
      })
    );
    const confirmada: Transaccion = { ...pendiente, estado: 'Confirmada' };
    setTransacciones((previas) => [confirmada, ...previas]);
    setPendiente(null);
    setMensajeOperacion(`Transacción confirmada: ${confirmada.tipo} por ${formatoMoneda(confirmada.monto)}.`);
    setMonto('');
    setDescripcion('');
  }

  function cancelarPendiente() {
    setPendiente(null);
    setMensajeOperacion('Transacción cancelada, no se afectaron saldos.');
  }

  function anularTransaccion(id: string) {
    setTransacciones((previas) =>
      previas.map((t) => {
        if (t.id !== id || t.estado !== 'Confirmada') return t;
        setCuentas((cs) =>
          cs.map((c) => {
            if (c.id === t.cuentaOrigenId) return { ...c, saldo: c.saldo + t.monto };
            if (t.cuentaDestinoId && c.id === t.cuentaDestinoId) return { ...c, saldo: c.saldo - t.monto };
            return c;
          })
        );
        return { ...t, estado: 'Anulada' };
      })
    );
    setMensajeOperacion('Transacción anulada; saldos revertidos.');
  }

  function eliminarTransaccion(id: string) {
    setTransacciones((previas) => previas.filter((t) => t.id !== id));
    setMensajeOperacion('Transacción eliminada del historial.');
  }

  function probarCapacidad() {
    setCapacidadMensaje('Transacción de Cuentas');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-kicker">Banca por Internet · Cuentas</p>
        <h1>Transacción de Cuentas</h1>
        <p className="app-subtitle">
          Simula transferencias, depósitos y retiros entre cuentas ficticias, con confirmación explícita antes de
          afectar saldos.
        </p>
        <div className="capacidad-bloque">
          <button type="button" className="btn btn-secondary" onClick={probarCapacidad}>
            Probar capacidad
          </button>
          <span role="status" className="capacidad-status">
            {capacidadMensaje}
          </span>
        </div>
      </header>

      <section className="panel" aria-labelledby="titulo-cuentas">
        <h2 id="titulo-cuentas">Cuentas</h2>
        <div className="grid-cuentas">
          {cuentas.map((cuenta) => (
            <article key={cuenta.id} className="tarjeta-cuenta">
              <h3>{cuenta.alias}</h3>
              <p className="numero-cuenta">{cuenta.numero}</p>
              <p className="saldo-cuenta">{formatoMoneda(cuenta.saldo)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel" aria-labelledby="titulo-form">
        <h2 id="titulo-form">Nueva transacción</h2>
        <form className="formulario" onSubmit={solicitarTransaccion} noValidate>
          <div className="campo">
            <label htmlFor="tipo-transaccion">Tipo</label>
            <select
              id="tipo-transaccion"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoTransaccion)}
            >
              <option value="Transferencia">Transferencia</option>
              <option value="Depósito">Depósito</option>
              <option value="Retiro">Retiro</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="cuenta-origen">Cuenta origen</label>
            <select id="cuenta-origen" value={cuentaOrigenId} onChange={(e) => setCuentaOrigenId(e.target.value)}>
              {cuentas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.alias} ({c.numero})
                </option>
              ))}
            </select>
          </div>

          {tipo === 'Transferencia' && (
            <div className="campo">
              <label htmlFor="cuenta-destino">Cuenta destino</label>
              <select id="cuenta-destino" value={cuentaDestinoId} onChange={(e) => setCuentaDestinoId(e.target.value)}>
                {cuentas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.alias} ({c.numero})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="campo">
            <label htmlFor="monto">Monto</label>
            <input
              id="monto"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="100000"
            />
          </div>

          <div className="campo campo-ancho">
            <label htmlFor="descripcion">Descripción</label>
            <input
              id="descripcion"
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Motivo de la transacción"
            />
          </div>

          <div className="acciones-formulario">
            <button type="submit" className="btn btn-primary">
              Solicitar transacción
            </button>
          </div>

          {formError && (
            <p role="alert" className="mensaje-error">
              {formError}
            </p>
          )}
        </form>

        {pendiente && (
          <div className="confirmacion" role="region" aria-labelledby="titulo-confirmacion">
            <h3 id="titulo-confirmacion">Confirmar transacción</h3>
            <p>
              {pendiente.tipo} de {formatoMoneda(pendiente.monto)} desde{' '}
              <strong>{cuentaPorId.get(pendiente.cuentaOrigenId)?.alias}</strong>
              {pendiente.cuentaDestinoId && (
                <>
                  {' '}
                  hacia <strong>{cuentaPorId.get(pendiente.cuentaDestinoId)?.alias}</strong>
                </>
              )}
              . {pendiente.descripcion}
            </p>
            <div className="acciones-confirmacion">
              <button type="button" className="btn btn-primary" onClick={confirmarTransaccion}>
                Confirmar
              </button>
              <button type="button" className="btn btn-ghost" onClick={cancelarPendiente}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        <p role="status" className="mensaje-operacion">
          {mensajeOperacion}
        </p>
      </section>

      <section className="panel" aria-labelledby="titulo-historial">
        <h2 id="titulo-historial">Historial de transacciones</h2>
        <div className="filtros">
          <div className="campo">
            <label htmlFor="busqueda">Buscar</label>
            <input
              id="busqueda"
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Descripción, cuenta o tipo"
            />
          </div>
          <div className="campo">
            <label htmlFor="filtro-estado">Estado</label>
            <select
              id="filtro-estado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as 'Todas' | EstadoTransaccion)}
            >
              <option value="Todas">Todas</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Anulada">Anulada</option>
            </select>
          </div>
        </div>

        {transaccionesFiltradas.length === 0 ? (
          <p className="estado-vacio">No hay transacciones que coincidan con la búsqueda.</p>
        ) : (
          <div className="tabla-wrapper">
            <table className="tabla-transacciones">
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Origen</th>
                  <th scope="col">Destino</th>
                  <th scope="col">Monto</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {transaccionesFiltradas.map((t) => (
                  <tr key={t.id}>
                    <td>{formatoFecha(t.fecha)}</td>
                    <td>{t.tipo}</td>
                    <td>{cuentaPorId.get(t.cuentaOrigenId)?.alias ?? '—'}</td>
                    <td>{t.cuentaDestinoId ? cuentaPorId.get(t.cuentaDestinoId)?.alias ?? '—' : '—'}</td>
                    <td className="col-monto">{formatoMoneda(t.monto)}</td>
                    <td>
                      <span className={`badge badge-${t.estado.toLowerCase()}`}>{t.estado}</span>
                    </td>
                    <td className="col-acciones">
                      {t.estado === 'Confirmada' && (
                        <button type="button" className="btn btn-ghost btn-small" onClick={() => anularTransaccion(t.id)}>
                          Anular
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-ghost btn-small btn-danger"
                        onClick={() => eliminarTransaccion(t.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
