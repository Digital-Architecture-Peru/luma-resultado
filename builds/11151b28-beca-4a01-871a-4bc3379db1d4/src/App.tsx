import { useMemo, useState } from 'react';

type Cuenta = {
  id: string;
  alias: string;
  titular: string;
  tipo: 'Ahorros' | 'Corriente';
  saldo: number;
};

type Transaccion = {
  id: string;
  fecha: string;
  origenId: string;
  destinoId: string;
  monto: number;
  nota: string;
};

const CUENTAS_INICIALES: Cuenta[] = [
  { id: 'CTA-1001', alias: 'Cuenta principal', titular: 'Ana Pérez', tipo: 'Ahorros', saldo: 2_450_000 },
  { id: 'CTA-1002', alias: 'Gastos del hogar', titular: 'Ana Pérez', tipo: 'Corriente', saldo: 980_500 },
  { id: 'CTA-1003', alias: 'Fondo de viaje', titular: 'Ana Pérez', tipo: 'Ahorros', saldo: 3_120_750 },
];

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

function generarIdTransaccion(existentes: Transaccion[]): string {
  const siguiente = existentes.length + 1;
  return `TXN-${String(siguiente).padStart(4, '0')}`;
}

export default function App() {
  const [cuentas, setCuentas] = useState<Cuenta[]>(CUENTAS_INICIALES);
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [busqueda, setBusqueda] = useState('');

  const [origenId, setOrigenId] = useState(CUENTAS_INICIALES[0].id);
  const [destinoId, setDestinoId] = useState(CUENTAS_INICIALES[1].id);
  const [monto, setMonto] = useState('');
  const [nota, setNota] = useState('');

  const [mensajeTransferencia, setMensajeTransferencia] = useState('Completa el formulario y confirma para registrar una transacción.');
  const [errorTransferencia, setErrorTransferencia] = useState('');
  const [pendienteConfirmar, setPendienteConfirmar] = useState(false);

  const [mensajeCapacidad, setMensajeCapacidad] = useState('');

  const cuentasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return cuentas;
    return cuentas.filter(
      (c) =>
        c.alias.toLowerCase().includes(termino) ||
        c.id.toLowerCase().includes(termino) ||
        c.tipo.toLowerCase().includes(termino)
    );
  }, [cuentas, busqueda]);

  const cuentaOrigen = cuentas.find((c) => c.id === origenId);
  const cuentaDestino = cuentas.find((c) => c.id === destinoId);

  function validarTransferencia(): string {
    const montoNumero = Number(monto);
    if (!origenId || !destinoId) return 'Selecciona cuenta origen y destino.';
    if (origenId === destinoId) return 'La cuenta origen y destino deben ser distintas.';
    if (!monto || Number.isNaN(montoNumero) || montoNumero <= 0) return 'Ingresa un monto válido mayor a cero.';
    if (cuentaOrigen && montoNumero > cuentaOrigen.saldo) return 'Saldo insuficiente en la cuenta origen.';
    return '';
  }

  function solicitarConfirmacion() {
    const error = validarTransferencia();
    if (error) {
      setErrorTransferencia(error);
      setPendienteConfirmar(false);
      setMensajeTransferencia('');
      return;
    }
    setErrorTransferencia('');
    setPendienteConfirmar(true);
    setMensajeTransferencia(
      `Confirma: transferir ${formatoCOP.format(Number(monto))} de ${cuentaOrigen?.alias} a ${cuentaDestino?.alias}.`
    );
  }

  function confirmarTransferencia() {
    const error = validarTransferencia();
    if (error) {
      setErrorTransferencia(error);
      setPendienteConfirmar(false);
      return;
    }
    const montoNumero = Number(monto);
    setCuentas((prev) =>
      prev.map((c) => {
        if (c.id === origenId) return { ...c, saldo: c.saldo - montoNumero };
        if (c.id === destinoId) return { ...c, saldo: c.saldo + montoNumero };
        return c;
      })
    );
    const nueva: Transaccion = {
      id: generarIdTransaccion(transacciones),
      fecha: new Date().toLocaleString('es-CO'),
      origenId,
      destinoId,
      monto: montoNumero,
      nota: nota.trim() || 'Sin nota',
    };
    setTransacciones((prev) => [nueva, ...prev]);
    setMensajeTransferencia(
      `Transacción ${nueva.id} registrada: ${formatoCOP.format(montoNumero)} de ${cuentaOrigen?.alias} a ${cuentaDestino?.alias}.`
    );
    setErrorTransferencia('');
    setPendienteConfirmar(false);
    setMonto('');
    setNota('');
  }

  function cancelarConfirmacion() {
    setPendienteConfirmar(false);
    setMensajeTransferencia('Transacción cancelada. Completa el formulario para intentar de nuevo.');
  }

  function probarCapacidad() {
    setMensajeCapacidad('Transacción de Cuentas: capacidad simulada correctamente con datos en memoria.');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Transacción de Cuentas</h1>
        <p className="app-subtitle">Banca por Internet · Frontend React + TypeScript · datos ficticios en memoria</p>
        <div className="capacidad-bloque">
          <button type="button" className="btn btn-primary" onClick={probarCapacidad}>
            Probar capacidad
          </button>
          <p role="status" aria-live="polite" className="status-text">
            {mensajeCapacidad}
          </p>
        </div>
      </header>

      <section className="panel" aria-labelledby="titulo-cuentas">
        <div className="panel-head">
          <h2 id="titulo-cuentas">Cuentas</h2>
          <div className="campo-busqueda">
            <label htmlFor="busqueda-cuentas">Buscar cuenta</label>
            <input
              id="busqueda-cuentas"
              type="search"
              placeholder="Alias, número o tipo"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {cuentasFiltradas.length === 0 ? (
          <p className="estado-vacio">No se encontraron cuentas para "{busqueda}".</p>
        ) : (
          <div className="tabla-scroll">
            <table className="tabla-cuentas">
              <caption className="sr-only">Listado de cuentas con alias, titular, tipo y saldo</caption>
              <thead>
                <tr>
                  <th scope="col">Número</th>
                  <th scope="col">Alias</th>
                  <th scope="col">Titular</th>
                  <th scope="col">Tipo</th>
                  <th scope="col" className="num">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {cuentasFiltradas.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.alias}</td>
                    <td>{c.titular}</td>
                    <td>{c.tipo}</td>
                    <td className="num">{formatoCOP.format(c.saldo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel" aria-labelledby="titulo-transferencia">
        <h2 id="titulo-transferencia">Nueva transacción entre cuentas</h2>
        <form
          className="formulario"
          onSubmit={(e) => {
            e.preventDefault();
            solicitarConfirmacion();
          }}
        >
          <div className="campo">
            <label htmlFor="cuenta-origen">Cuenta origen</label>
            <select
              id="cuenta-origen"
              value={origenId}
              onChange={(e) => {
                setOrigenId(e.target.value);
                setPendienteConfirmar(false);
              }}
            >
              {cuentas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.alias} ({c.id}) · {formatoCOP.format(c.saldo)}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="cuenta-destino">Cuenta destino</label>
            <select
              id="cuenta-destino"
              value={destinoId}
              onChange={(e) => {
                setDestinoId(e.target.value);
                setPendienteConfirmar(false);
              }}
            >
              {cuentas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.alias} ({c.id})
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label htmlFor="monto">Monto a transferir</label>
            <input
              id="monto"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={monto}
              onChange={(e) => {
                setMonto(e.target.value);
                setPendienteConfirmar(false);
              }}
              placeholder="Ej: 150000"
            />
          </div>

          <div className="campo">
            <label htmlFor="nota">Nota (opcional)</label>
            <input
              id="nota"
              type="text"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Ej: Pago de arriendo"
              maxLength={80}
            />
          </div>

          <div className="acciones-formulario">
            {!pendienteConfirmar ? (
              <button type="submit" className="btn btn-primary">
                Revisar transacción
              </button>
            ) : (
              <>
                <button type="button" className="btn btn-primary" onClick={confirmarTransferencia}>
                  Confirmar transacción
                </button>
                <button type="button" className="btn btn-secondary" onClick={cancelarConfirmacion}>
                  Cancelar
                </button>
              </>
            )}
          </div>
        </form>

        {errorTransferencia && (
          <p role="alert" className="mensaje-error">
            {errorTransferencia}
          </p>
        )}
        <p role="status" aria-live="polite" className="status-text">
          {mensajeTransferencia}
        </p>
      </section>

      <section className="panel" aria-labelledby="titulo-historial">
        <h2 id="titulo-historial">Historial de transacciones</h2>
        {transacciones.length === 0 ? (
          <p className="estado-vacio">Aún no se registran transacciones en esta sesión.</p>
        ) : (
          <ul className="lista-historial">
            {transacciones.map((t) => {
              const origen = cuentas.find((c) => c.id === t.origenId);
              const destino = cuentas.find((c) => c.id === t.destinoId);
              return (
                <li key={t.id} className="item-historial">
                  <span className="historial-id">{t.id}</span>
                  <span>{t.fecha}</span>
                  <span>
                    {origen?.alias ?? t.origenId} → {destino?.alias ?? t.destinoId}
                  </span>
                  <span className="num">{formatoCOP.format(t.monto)}</span>
                  <span className="historial-nota">{t.nota}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
