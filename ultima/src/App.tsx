import { useMemo, useState } from 'react';

type Cuenta = {
  id: string;
  alias: string;
  tipo: 'Ahorros' | 'Corriente' | 'Nómina';
  numero: string;
  moneda: 'USD' | 'EUR';
  saldo: number;
  movimientos: { id: string; fecha: string; descripcion: string; monto: number }[];
};

const CUENTAS: Cuenta[] = [
  {
    id: 'c1',
    alias: 'Cuenta principal',
    tipo: 'Ahorros',
    numero: '0012345678',
    moneda: 'USD',
    saldo: 4520.33,
    movimientos: [
      { id: 'm1', fecha: '2026-10-01', descripcion: 'Depósito nómina', monto: 1800 },
      { id: 'm2', fecha: '2026-10-03', descripcion: 'Pago servicios', monto: -120.5 },
      { id: 'm3', fecha: '2026-10-05', descripcion: 'Transferencia recibida', monto: 300 },
    ],
  },
  {
    id: 'c2',
    alias: 'Gastos corrientes',
    tipo: 'Corriente',
    numero: '0098765432',
    moneda: 'USD',
    saldo: 1275.8,
    movimientos: [
      { id: 'm4', fecha: '2026-09-28', descripcion: 'Compra supermercado', monto: -85.2 },
      { id: 'm5', fecha: '2026-10-02', descripcion: 'Retiro cajero', monto: -200 },
    ],
  },
  {
    id: 'c3',
    alias: 'Ahorro viajes',
    tipo: 'Nómina',
    numero: '0055501234',
    moneda: 'EUR',
    saldo: 980.0,
    movimientos: [
      { id: 'm6', fecha: '2026-09-15', descripcion: 'Aporte mensual', monto: 150 },
      { id: 'm7', fecha: '2026-10-04', descripcion: 'Intereses', monto: 2.1 },
    ],
  },
];

function maskAccount(numero: string): string {
  const last4 = numero.slice(-4);
  return `•••• ${last4}`;
}

function formatBalance(saldo: number, moneda: Cuenta['moneda']): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: moneda }).format(saldo);
}

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>(CUENTAS[0].id);
  const [capacityStatus, setCapacityStatus] = useState('');

  const cuentasFiltradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CUENTAS;
    return CUENTAS.filter(
      (c) =>
        c.alias.toLowerCase().includes(q) ||
        c.tipo.toLowerCase().includes(q) ||
        c.numero.includes(q)
    );
  }, [query]);

  const cuentaSeleccionada = useMemo(
    () => CUENTAS.find((c) => c.id === selectedId) ?? null,
    [selectedId]
  );

  function handleProbarCapacidad() {
    setCapacityStatus('Consulta de Cuentas');
  }

  return (
    <main className="mf-cuentas">
      <header className="mf-cuentas__header">
        <div>
          <h1>Consulta de Cuentas</h1>
          <p>Banca por Internet · Micro-frontend de solo lectura</p>
        </div>
        <span className="mf-cuentas__badge" role="note">
          Datos ficticios — sin conexión a sistemas reales
        </span>
      </header>

      <section className="mf-cuentas__toolbar" aria-label="Acciones de la capacidad">
        <button type="button" className="mf-cuentas__btn-primary" onClick={handleProbarCapacidad}>
          Probar capacidad
        </button>
        <div role="status" aria-live="polite" className="mf-cuentas__status">
          {capacityStatus}
        </div>
      </section>

      <section className="mf-cuentas__search" aria-label="Buscar cuentas">
        <label htmlFor="buscar-cuentas">Buscar por alias, tipo o número</label>
        <input
          id="buscar-cuentas"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej. Ahorros, 1234, Gastos"
        />
      </section>

      <div className="mf-cuentas__layout">
        <section aria-label="Listado de cuentas" className="mf-cuentas__list-panel">
          <h2>Mis cuentas</h2>
          {cuentasFiltradas.length === 0 ? (
            <p className="mf-cuentas__empty">Sin resultados para esta búsqueda.</p>
          ) : (
            <ul className="mf-cuentas__list">
              {cuentasFiltradas.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    aria-pressed={c.id === selectedId}
                    className={
                      'mf-cuentas__list-item' +
                      (c.id === selectedId ? ' mf-cuentas__list-item--active' : '')
                    }
                    onClick={() => setSelectedId(c.id)}
                  >
                    <span className="mf-cuentas__alias">{c.alias}</span>
                    <span className="mf-cuentas__meta">
                      {c.tipo} · {maskAccount(c.numero)}
                    </span>
                    <span className="mf-cuentas__saldo">{formatBalance(c.saldo, c.moneda)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Detalle de cuenta" className="mf-cuentas__detail-panel">
          {cuentaSeleccionada ? (
            <>
              <h2>{cuentaSeleccionada.alias}</h2>
              <dl className="mf-cuentas__detail-grid">
                <div>
                  <dt>Tipo</dt>
                  <dd>{cuentaSeleccionada.tipo}</dd>
                </div>
                <div>
                  <dt>Número</dt>
                  <dd>{maskAccount(cuentaSeleccionada.numero)}</dd>
                </div>
                <div>
                  <dt>Moneda</dt>
                  <dd>{cuentaSeleccionada.moneda}</dd>
                </div>
                <div>
                  <dt>Saldo disponible</dt>
                  <dd>{formatBalance(cuentaSeleccionada.saldo, cuentaSeleccionada.moneda)}</dd>
                </div>
              </dl>

              <h3>Movimientos recientes</h3>
              {cuentaSeleccionada.movimientos.length === 0 ? (
                <p className="mf-cuentas__empty">Esta cuenta no tiene movimientos.</p>
              ) : (
                <table className="mf-cuentas__table">
                  <caption className="mf-cuentas__sr-only">
                    Movimientos de {cuentaSeleccionada.alias}
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Fecha</th>
                      <th scope="col">Descripción</th>
                      <th scope="col">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuentaSeleccionada.movimientos.map((m) => (
                      <tr key={m.id}>
                        <td>{m.fecha}</td>
                        <td>{m.descripcion}</td>
                        <td className={m.monto < 0 ? 'mf-cuentas__monto-neg' : 'mf-cuentas__monto-pos'}>
                          {formatBalance(m.monto, cuentaSeleccionada.moneda)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <p className="mf-cuentas__empty">Selecciona una cuenta para ver el detalle.</p>
          )}
        </section>
      </div>
    </main>
  );
}
