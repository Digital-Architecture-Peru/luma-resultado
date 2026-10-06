import { useMemo, useState } from 'react';

type Cuenta = {
  id: string;
  alias: string;
  numero: string;
  saldo: number;
};

type Transaccion = {
  id: string;
  fecha: string;
  cuentaOrigenId: string;
  cuentaDestinoId: string;
  monto: number;
  concepto: string;
  estado: 'confirmada';
};

const CUENTAS_INICIALES: Cuenta[] = [
  { id: 'c1', alias: 'Cuenta Nómina', numero: '0001-2233-44', saldo: 2500.75 },
  { id: 'c2', alias: 'Cuenta Ahorros', numero: '0005-8899-01', saldo: 9800.0 },
  { id: 'c3', alias: 'Cuenta Negocios', numero: '0009-1122-77', saldo: 540.2 },
];

const TRANSACCIONES_INICIALES: Transaccion[] = [
  {
    id: 't1',
    fecha: '2026-09-28',
    cuentaOrigenId: 'c1',
    cuentaDestinoId: 'c2',
    monto: 150,
    concepto: 'Ahorro mensual',
    estado: 'confirmada',
  },
  {
    id: 't2',
    fecha: '2026-10-01',
    cuentaOrigenId: 'c2',
    cuentaDestinoId: 'c3',
    monto: 320.5,
    concepto: 'Pago proveedor',
    estado: 'confirmada',
  },
];

function formatoMoneda(valor: number): string {
  return valor.toLocaleString('es-ES', { style: 'currency', currency: 'USD' });
}

function generarId(prefijo: string): string {
  return `${prefijo}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
}

export default function App() {
  const [cuentas, setCuentas] = useState<Cuenta[]>(CUENTAS_INICIALES);
  const [transacciones, setTransacciones] = useState<Transaccion[]>(TRANSACCIONES_INICIALES);

  const [cuentaOrigenId, setCuentaOrigenId] = useState(cuentas[0]?.id ?? '');
  const [cuentaDestinoId, setCuentaDestinoId] = useState(cuentas[1]?.id ?? '');
  const [monto, setMonto] = useState('');
  const [concepto, setConcepto] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmacion, setConfirmacion] = useState('');

  const [busqueda, setBusqueda] = useState('');
  const [pendienteEliminarId, setPendienteEliminarId] = useState<string | null>(null);

  const [capacidadStatus, setCapacidadStatus] = useState('');

  const cuentaPorId = useMemo(() => {
    const mapa = new Map<string, Cuenta>();
    cuentas.forEach((c) => mapa.set(c.id, c));
    return mapa;
  }, [cuentas]);

  const transaccionesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return transacciones;
    return transacciones.filter((t) => {
      const origen = cuentaPorId.get(t.cuentaOrigenId);
      const destino = cuentaPorId.get(t.cuentaDestinoId);
      return (
        t.concepto.toLowerCase().includes(termino) ||
        origen?.alias.toLowerCase().includes(termino) ||
        destino?.alias.toLowerCase().includes(termino) ||
        t.monto.toString().includes(termino)
      );
    });
  }, [busqueda, transacciones, cuentaPorId]);

  function limpiarFormulario() {
    setMonto('');
    setConcepto('');
    setFormError('');
  }

  function registrarTransaccion(e: React.FormEvent) {
    e.preventDefault();
    setConfirmacion('');

    const montoNumero = parseFloat(monto);

    if (!cuentaOrigenId || !cuentaDestinoId) {
      setFormError('Selecciona cuenta origen y destino.');
      return;
    }
    if (cuentaOrigenId === cuentaDestinoId) {
      setFormError('La cuenta origen y destino deben ser distintas.');
      return;
    }
    if (!monto || Number.isNaN(montoNumero) || montoNumero <= 0) {
      setFormError('Ingresa un monto válido mayor a 0.');
      return;
    }
    if (!concepto.trim()) {
      setFormError('Ingresa un concepto para la transacción.');
      return;
    }
    const origen = cuentaPorId.get(cuentaOrigenId);
    if (!origen || origen.saldo < montoNumero) {
      setFormError('Saldo insuficiente en la cuenta origen.');
      return;
    }

    const nueva: Transaccion = {
      id: generarId('t'),
      fecha: new Date().toISOString().slice(0, 10),
      cuentaOrigenId,
      cuentaDestinoId,
      monto: montoNumero,
      concepto: concepto.trim(),
      estado: 'confirmada',
    };

    setTransacciones((prev) => [nueva, ...prev]);
    setCuentas((prev) =>
      prev.map((c) => {
        if (c.id === cuentaOrigenId) return { ...c, saldo: c.saldo - montoNumero };
        if (c.id === cuentaDestinoId) return { ...c, saldo: c.saldo + montoNumero };
        return c;
      }),
    );

    setFormError('');
    setConfirmacion(
      `Transacción registrada: ${formatoMoneda(montoNumero)} de ${origen.alias} hacia ${
        cuentaPorId.get(cuentaDestinoId)?.alias ?? ''
      }.`,
    );
    limpiarFormulario();
  }

  function solicitarEliminar(id: string) {
    setPendienteEliminarId(id);
  }

  function confirmarEliminar(id: string) {
    setTransacciones((prev) => prev.filter((t) => t.id !== id));
    setPendienteEliminarId(null);
    setConfirmacion('Transacción eliminada del historial.');
  }

  function cancelarEliminar() {
    setPendienteEliminarId(null);
  }

  function probarCapacidad() {
    setCapacidadStatus('Capacidad simulada');
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1>Banca por Internet · Transacciones de Cuentas</h1>
        <p>
          Microapp de demostración (datos ficticios en memoria). Capa Frontend, stack React +
          TypeScript, patrón API + eventos, sin persistencia ni integración real.
        </p>
      </header>

      <section className="panel panel--capacidad" aria-labelledby="capacidad-heading">
        <h2 id="capacidad-heading">Verificación rápida de la capacidad</h2>
        <p>Usa este botón para confirmar que la capacidad de transacción responde correctamente.</p>
        <button type="button" className="btn btn--primary" onClick={probarCapacidad}>
          Probar capacidad
        </button>
        <p role="status" className="status-text">
          {capacidadStatus}
        </p>
      </section>

      <section className="panel" aria-labelledby="cuentas-heading">
        <h2 id="cuentas-heading">Cuentas</h2>
        <ul className="cuentas-list">
          {cuentas.map((c) => (
            <li key={c.id} className="cuentas-list__item">
              <span className="cuentas-list__alias">{c.alias}</span>
              <span className="cuentas-list__numero">{c.numero}</span>
              <span className="cuentas-list__saldo">{formatoMoneda(c.saldo)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel" aria-labelledby="form-heading">
        <h2 id="form-heading">Nueva transacción</h2>
        <form onSubmit={registrarTransaccion} className="form" noValidate>
          <div className="form__row">
            <label htmlFor="origen">Cuenta origen</label>
            <select
              id="origen"
              value={cuentaOrigenId}
              onChange={(e) => setCuentaOrigenId(e.target.value)}
            >
              {cuentas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.alias} ({c.numero})
                </option>
              ))}
            </select>
          </div>

          <div className="form__row">
            <label htmlFor="destino">Cuenta destino</label>
            <select
              id="destino"
              value={cuentaDestinoId}
              onChange={(e) => setCuentaDestinoId(e.target.value)}
            >
              {cuentas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.alias} ({c.numero})
                </option>
              ))}
            </select>
          </div>

          <div className="form__row">
            <label htmlFor="monto">Monto</label>
            <input
              id="monto"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="form__row">
            <label htmlFor="concepto">Concepto</label>
            <input
              id="concepto"
              type="text"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej. Pago de servicios"
            />
          </div>

          <button type="submit" className="btn btn--secondary">
            Registrar transacción
          </button>

          {formError && (
            <p role="alert" className="form__error">
              {formError}
            </p>
          )}
          {confirmacion && (
            <p role="status" className="form__confirmacion">
              {confirmacion}
            </p>
          )}
        </form>
      </section>

      <section className="panel" aria-labelledby="historial-heading">
        <h2 id="historial-heading">Historial de transacciones</h2>

        <div className="form__row">
          <label htmlFor="busqueda">Buscar</label>
          <input
            id="busqueda"
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Por concepto, cuenta o monto"
          />
        </div>

        {transaccionesFiltradas.length === 0 ? (
          <p className="estado-vacio">No hay transacciones que coincidan con la búsqueda.</p>
        ) : (
          <ul className="transacciones-list">
            {transaccionesFiltradas.map((t) => {
              const origen = cuentaPorId.get(t.cuentaOrigenId);
              const destino = cuentaPorId.get(t.cuentaDestinoId);
              return (
                <li key={t.id} className="transacciones-list__item">
                  <div className="transacciones-list__info">
                    <span className="transacciones-list__fecha">{t.fecha}</span>
                    <span>
                      {origen?.alias ?? '—'} → {destino?.alias ?? '—'}
                    </span>
                    <span className="transacciones-list__monto">{formatoMoneda(t.monto)}</span>
                    <span className="transacciones-list__concepto">{t.concepto}</span>
                  </div>

                  {pendienteEliminarId === t.id ? (
                    <div className="confirm-inline">
                      <span>¿Eliminar esta transacción?</span>
                      <button
                        type="button"
                        className="btn btn--danger"
                        onClick={() => confirmarEliminar(t.id)}
                      >
                        Confirmar
                      </button>
                      <button type="button" className="btn btn--ghost" onClick={cancelarEliminar}>
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => solicitarEliminar(t.id)}
                      aria-label={`Eliminar transacción ${t.concepto}`}
                    >
                      Eliminar
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
