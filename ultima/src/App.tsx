import { useMemo, useState } from 'react';

type TipoCuenta = 'Ahorros' | 'Corriente' | 'Plazo Fijo';
type EstadoCuenta = 'Activa' | 'Inactiva' | 'Bloqueada';

interface Movimiento {
  id: string;
  fecha: string;
  descripcion: string;
  monto: number;
}

interface Cuenta {
  id: string;
  numero: string;
  titular: string;
  tipo: TipoCuenta;
  estado: EstadoCuenta;
  saldo: number;
  movimientos: Movimiento[];
}

const CUENTAS_INICIALES: Cuenta[] = [
  {
    id: 'c1',
    numero: '001-0023456-7',
    titular: 'María Fernández',
    tipo: 'Ahorros',
    estado: 'Activa',
    saldo: 4582.3,
    movimientos: [
      { id: 'm1', fecha: '2026-10-01', descripcion: 'Depósito nómina', monto: 1200 },
      { id: 'm2', fecha: '2026-10-03', descripcion: 'Pago de servicios', monto: -85.4 },
      { id: 'm3', fecha: '2026-10-05', descripcion: 'Transferencia recibida', monto: 300 },
    ],
  },
  {
    id: 'c2',
    numero: '001-0098123-4',
    titular: 'Jorge Ramírez',
    tipo: 'Corriente',
    estado: 'Activa',
    saldo: 12890.75,
    movimientos: [
      { id: 'm4', fecha: '2026-09-28', descripcion: 'Pago a proveedor', monto: -2300 },
      { id: 'm5', fecha: '2026-10-02', descripcion: 'Depósito en efectivo', monto: 5000 },
    ],
  },
  {
    id: 'c3',
    numero: '001-0045678-9',
    titular: 'Luisa Martínez',
    tipo: 'Plazo Fijo',
    estado: 'Bloqueada',
    saldo: 25000,
    movimientos: [{ id: 'm6', fecha: '2026-08-15', descripcion: 'Apertura de depósito', monto: 25000 }],
  },
  {
    id: 'c4',
    numero: '001-0011222-3',
    titular: 'Carlos Peña',
    tipo: 'Ahorros',
    estado: 'Inactiva',
    saldo: 0,
    movimientos: [],
  },
];

const formatoMoneda = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' });
const formatoFecha = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('es-ES');

function estadoBadgeClase(estado: EstadoCuenta): string {
  if (estado === 'Activa') return 'badge badge--success';
  if (estado === 'Inactiva') return 'badge badge--muted';
  return 'badge badge--danger';
}

export default function App() {
  const [capacidadProbada, setCapacidadProbada] = useState(false);
  const [cuentas] = useState<Cuenta[]>(CUENTAS_INICIALES);
  const [termino, setTermino] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | EstadoCuenta>('Todos');
  const [seleccionId, setSeleccionId] = useState<string | null>(null);
  const [confirmarOcultarId, setConfirmarOcultarId] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string>('');

  const cuentasFiltradas = useMemo(() => {
    const t = termino.trim().toLowerCase();
    return cuentas.filter((c) => {
      const coincideTermino =
        t.length === 0 || c.numero.toLowerCase().includes(t) || c.titular.toLowerCase().includes(t);
      const coincideEstado = filtroEstado === 'Todos' || c.estado === filtroEstado;
      return coincideTermino && coincideEstado;
    });
  }, [cuentas, termino, filtroEstado]);

  const cuentaSeleccionada = useMemo(
    () => cuentas.find((c) => c.id === seleccionId) ?? null,
    [cuentas, seleccionId]
  );

  function manejarConsultar(id: string) {
    setSeleccionId(id);
    setMensaje('Cuenta consultada correctamente.');
  }

  function manejarPedirConfirmacion(id: string) {
    setConfirmarOcultarId(id);
  }

  function manejarConfirmarOcultar(id: string) {
    if (seleccionId === id) {
      setSeleccionId(null);
    }
    setConfirmarOcultarId(null);
    setMensaje('Detalle de la cuenta ocultado de la vista actual (dato ficticio, sin persistencia).');
  }

  function manejarCancelarOcultar() {
    setConfirmarOcultarId(null);
  }

  return (
    <main className="app">
      <header className="app__header">
        <div>
          <p className="app__eyebrow">Banca por Internet · Cuentas</p>
          <h1 className="app__title">Consulta de Cuentas</h1>
          <p className="app__subtitle">
            Busca una cuenta, revisa su saldo y movimientos recientes. Datos ficticios en memoria, sin conexión
            externa.
          </p>
        </div>
        <div className="app__demo">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setCapacidadProbada(true)}
          >
            Probar capacidad
          </button>
          <p role="status" className="app__demo-status">
            {capacidadProbada ? 'Consulta de Cuentas' : ''}
          </p>
        </div>
      </header>

      {mensaje && (
        <p role="status" className="toast">
          {mensaje}
        </p>
      )}

      <section className="panel" aria-labelledby="buscar-heading">
        <h2 id="buscar-heading" className="panel__title">
          Buscar cuentas
        </h2>
        <div className="form-row">
          <div className="field">
            <label htmlFor="termino-busqueda">Número de cuenta o titular</label>
            <input
              id="termino-busqueda"
              type="search"
              placeholder="Ej. 001-0023456-7 o María Fernández"
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="filtro-estado">Estado</label>
            <select
              id="filtro-estado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as 'Todos' | EstadoCuenta)}
            >
              <option value="Todos">Todos</option>
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
              <option value="Bloqueada">Bloqueada</option>
            </select>
          </div>
        </div>
      </section>

      <section className="panel" aria-labelledby="resultados-heading">
        <h2 id="resultados-heading" className="panel__title">
          Resultados ({cuentasFiltradas.length})
        </h2>
        {cuentasFiltradas.length === 0 ? (
          <p className="estado-vacio">No se encontraron cuentas con ese criterio.</p>
        ) : (
          <div className="tabla-wrap">
            <table className="tabla">
              <thead>
                <tr>
                  <th scope="col">Número</th>
                  <th scope="col">Titular</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Estado</th>
                  <th scope="col" className="num">
                    Saldo
                  </th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cuentasFiltradas.map((c) => (
                  <tr key={c.id}>
                    <td>{c.numero}</td>
                    <td>{c.titular}</td>
                    <td>{c.tipo}</td>
                    <td>
                      <span className={estadoBadgeClase(c.estado)}>{c.estado}</span>
                    </td>
                    <td className="num">{formatoMoneda.format(c.saldo)}</td>
                    <td className="acciones">
                      <button type="button" className="btn btn--secondary" onClick={() => manejarConsultar(c.id)}>
                        Ver detalle
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => manejarPedirConfirmacion(c.id)}
                      >
                        Ocultar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {confirmarOcultarId && (
        <section className="panel panel--confirm" role="alertdialog" aria-labelledby="confirm-heading">
          <h2 id="confirm-heading" className="panel__title">
            Confirmar acción
          </h2>
          <p>¿Deseas ocultar esta cuenta de los resultados actuales? Es solo una vista local y no se elimina nada.</p>
          <div className="acciones">
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => manejarConfirmarOcultar(confirmarOcultarId)}
            >
              Sí, ocultar
            </button>
            <button type="button" className="btn btn--secondary" onClick={manejarCancelarOcultar}>
              Cancelar
            </button>
          </div>
        </section>
      )}

      {cuentaSeleccionada && (
        <section className="panel" aria-labelledby="detalle-heading">
          <h2 id="detalle-heading" className="panel__title">
            Detalle de {cuentaSeleccionada.titular}
          </h2>
          <dl className="detalle-grid">
            <div>
              <dt>Número</dt>
              <dd>{cuentaSeleccionada.numero}</dd>
            </div>
            <div>
              <dt>Tipo</dt>
              <dd>{cuentaSeleccionada.tipo}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>
                <span className={estadoBadgeClase(cuentaSeleccionada.estado)}>{cuentaSeleccionada.estado}</span>
              </dd>
            </div>
            <div>
              <dt>Saldo disponible</dt>
              <dd className="num">{formatoMoneda.format(cuentaSeleccionada.saldo)}</dd>
            </div>
          </dl>

          <h3 className="panel__subtitle">Movimientos recientes</h3>
          {cuentaSeleccionada.movimientos.length === 0 ? (
            <p className="estado-vacio">Sin movimientos registrados.</p>
          ) : (
            <ul className="movimientos">
              {cuentaSeleccionada.movimientos.map((m) => (
                <li key={m.id} className="movimientos__item">
                  <span className="movimientos__fecha">{formatoFecha(m.fecha)}</span>
                  <span className="movimientos__desc">{m.descripcion}</span>
                  <span className={`movimientos__monto ${m.monto < 0 ? 'num-neg' : 'num-pos'}`}>
                    {formatoMoneda.format(m.monto)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <footer className="app__footer">
        <p>Entorno de demostración: datos ficticios en memoria, sin persistencia ni conexión externa.</p>
      </footer>
    </main>
  );
}
