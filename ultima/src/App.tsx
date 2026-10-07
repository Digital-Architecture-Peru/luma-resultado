import { useMemo, useState } from 'react';

/**
 * Feature: Consulta de Tarjetas (Banca por Internet)
 * Patrón: Feature-Sliced Design (capas lógicas dentro del archivo único permitido)
 *  - entities/tarjeta: tipos y datos ficticios
 *  - features/buscar-tarjeta: estado y lógica de filtro
 *  - features/bloquear-tarjeta: acción con confirmación inline
 *  - widgets/panel-consulta: composición de la pantalla
 * Datos en memoria, sin red ni persistencia.
 */

// ---------- entities/tarjeta ----------
type EstadoTarjeta = 'Activa' | 'Bloqueada' | 'Vencida';
type TipoTarjeta = 'Débito' | 'Crédito';

interface Tarjeta {
  id: string;
  numeroMasked: string;
  titular: string;
  tipo: TipoTarjeta;
  estado: EstadoTarjeta;
  saldo: number;
  limite: number;
}

const TARJETAS_INICIALES: Tarjeta[] = [
  { id: 't1', numeroMasked: '4532 **** **** 1187', titular: 'Ana Rojas', tipo: 'Débito', estado: 'Activa', saldo: 1250000, limite: 3000000 },
  { id: 't2', numeroMasked: '5500 **** **** 2244', titular: 'Carlos Pena', tipo: 'Crédito', estado: 'Activa', saldo: 420000, limite: 5000000 },
  { id: 't3', numeroMasked: '4916 **** **** 7731', titular: 'Marta Díaz', tipo: 'Débito', estado: 'Bloqueada', saldo: 98000, limite: 1500000 },
  { id: 't4', numeroMasked: '6011 **** **** 0098', titular: 'Jorge Salas', tipo: 'Crédito', estado: 'Vencida', saldo: 0, limite: 2000000 },
  { id: 't5', numeroMasked: '4024 **** **** 5567', titular: 'Ana Rojas', tipo: 'Crédito', estado: 'Activa', saldo: 310000, limite: 4000000 },
];

function formatCOP(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}

// ---------- widgets/panel-consulta ----------
export default function App() {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>(TARJETAS_INICIALES);
  const [termino, setTermino] = useState('');
  const [seleccionId, setSeleccionId] = useState<string | null>(null);
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string>('');
  const [capacidadTexto, setCapacidadTexto] = useState<string>('');

  const resultados = useMemo(() => {
    const t = termino.trim().toLowerCase();
    if (!t) return tarjetas;
    return tarjetas.filter(
      (tj) => tj.titular.toLowerCase().includes(t) || tj.numeroMasked.toLowerCase().includes(t) || tj.estado.toLowerCase().includes(t)
    );
  }, [termino, tarjetas]);

  const seleccionada = tarjetas.find((t) => t.id === seleccionId) ?? null;

  function iniciarCambioEstado(id: string) {
    setConfirmandoId(id);
    setMensaje('');
  }

  function cancelarCambioEstado() {
    setConfirmandoId(null);
  }

  function confirmarCambioEstado(id: string) {
    setTarjetas((prev) =>
      prev.map((tj) => {
        if (tj.id !== id) return tj;
        const nuevoEstado: EstadoTarjeta = tj.estado === 'Bloqueada' ? 'Activa' : 'Bloqueada';
        return { ...tj, estado: nuevoEstado };
      })
    );
    const tj = tarjetas.find((x) => x.id === id);
    const nuevoEstado = tj?.estado === 'Bloqueada' ? 'Activa' : 'Bloqueada';
    setMensaje(`Tarjeta ${tj?.numeroMasked ?? ''} actualizada a estado ${nuevoEstado}.`);
    setConfirmandoId(null);
  }

  function probarCapacidad() {
    setCapacidadTexto('Consulta de Tarjetas');
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1>Consulta de Tarjetas</h1>
        <p className="app__subtitle">Banca por Internet · Capa Frontend · Datos ficticios en memoria</p>
      </header>

      <section className="panel" aria-labelledby="capacidad-h">
        <h2 id="capacidad-h">Capacidad</h2>
        <button type="button" className="btn btn--primary" onClick={probarCapacidad}>
          Probar capacidad
        </button>
        <p role="status" className="status-line">
          {capacidadTexto}
        </p>
      </section>

      <section className="panel" aria-labelledby="buscar-h">
        <h2 id="buscar-h">Buscar tarjetas</h2>
        <div className="search-row">
          <label htmlFor="busqueda" className="visually-hidden">
            Buscar por titular, número o estado
          </label>
          <input
            id="busqueda"
            type="search"
            className="input"
            placeholder="Buscar por titular, número o estado…"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
          />
        </div>

        <div className="table-wrap">
          <table className="table">
            <caption className="visually-hidden">Resultado de la búsqueda de tarjetas</caption>
            <thead>
              <tr>
                <th scope="col">Número</th>
                <th scope="col">Titular</th>
                <th scope="col">Tipo</th>
                <th scope="col">Estado</th>
                <th scope="col" className="num">Saldo</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resultados.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-state">
                    No se encontraron tarjetas con ese criterio.
                  </td>
                </tr>
              )}
              {resultados.map((tj) => (
                <tr key={tj.id} className={seleccionId === tj.id ? 'row--selected' : ''}>
                  <td>{tj.numeroMasked}</td>
                  <td>{tj.titular}</td>
                  <td>{tj.tipo}</td>
                  <td>
                    <span className={`badge badge--${tj.estado.toLowerCase()}`}>{tj.estado}</span>
                  </td>
                  <td className="num">{formatCOP(tj.saldo)}</td>
                  <td className="actions-cell">
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => setSeleccionId(tj.id)}
                      aria-pressed={seleccionId === tj.id}
                    >
                      Ver detalle
                    </button>
                    {tj.estado !== 'Vencida' && confirmandoId !== tj.id && (
                      <button type="button" className="btn btn--secondary btn--sm" onClick={() => iniciarCambioEstado(tj.id)}>
                        {tj.estado === 'Bloqueada' ? 'Desbloquear' : 'Bloquear'}
                      </button>
                    )}
                    {confirmandoId === tj.id && (
                      <span className="confirm-inline">
                        <span>¿Confirmar {tj.estado === 'Bloqueada' ? 'desbloqueo' : 'bloqueo'}?</span>
                        <button type="button" className="btn btn--danger btn--sm" onClick={() => confirmarCambioEstado(tj.id)}>
                          Confirmar
                        </button>
                        <button type="button" className="btn btn--ghost btn--sm" onClick={cancelarCambioEstado}>
                          Cancelar
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p role="status" className="status-line">
          {mensaje}
        </p>
      </section>

      {seleccionada && (
        <section className="panel panel--detalle" aria-labelledby="detalle-h">
          <h2 id="detalle-h">Detalle de tarjeta</h2>
          <dl className="detail-grid">
            <div>
              <dt>Número</dt>
              <dd>{seleccionada.numeroMasked}</dd>
            </div>
            <div>
              <dt>Titular</dt>
              <dd>{seleccionada.titular}</dd>
            </div>
            <div>
              <dt>Tipo</dt>
              <dd>{seleccionada.tipo}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{seleccionada.estado}</dd>
            </div>
            <div>
              <dt>Saldo</dt>
              <dd className="num">{formatCOP(seleccionada.saldo)}</dd>
            </div>
            <div>
              <dt>Límite</dt>
              <dd className="num">{formatCOP(seleccionada.limite)}</dd>
            </div>
          </dl>
          <button type="button" className="btn btn--ghost" onClick={() => setSeleccionId(null)}>
            Cerrar detalle
          </button>
        </section>
      )}
    </main>
  );
}
