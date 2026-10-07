import { useMemo, useState } from 'react';

type Estado = 'no-leida' | 'leida';
type Tipo = 'bloqueo' | 'pago' | 'fraude' | 'limite';

interface NotificacionTarjeta {
  id: string;
  titulo: string;
  detalle: string;
  tarjeta: string;
  tipo: Tipo;
  estado: Estado;
  fecha: string;
}

const TIPO_LABEL: Record<Tipo, string> = {
  bloqueo: 'Bloqueo',
  pago: 'Pago',
  fraude: 'Alerta de fraude',
  limite: 'Límite de crédito',
};

const SEED: NotificacionTarjeta[] = [
  {
    id: 'n1',
    titulo: 'Pago aprobado',
    detalle: 'Compra de $45.900 en Supermercado Luma aprobada.',
    tarjeta: '**** 4521',
    tipo: 'pago',
    estado: 'no-leida',
    fecha: '2026-10-05 09:12',
  },
  {
    id: 'n2',
    titulo: 'Tarjeta bloqueada temporalmente',
    detalle: 'Bloqueamos tu tarjeta por intentos fallidos de PIN.',
    tarjeta: '**** 7788',
    tipo: 'bloqueo',
    estado: 'no-leida',
    fecha: '2026-10-04 18:40',
  },
  {
    id: 'n3',
    titulo: 'Posible fraude detectado',
    detalle: 'Revisa un cargo inusual en un comercio no reconocido.',
    tarjeta: '**** 4521',
    tipo: 'fraude',
    estado: 'leida',
    fecha: '2026-10-03 07:55',
  },
  {
    id: 'n4',
    titulo: 'Cerca del límite de crédito',
    detalle: 'Has usado el 92% de tu cupo disponible.',
    tarjeta: '**** 1190',
    tipo: 'limite',
    estado: 'leida',
    fecha: '2026-10-01 12:03',
  },
];

let nextId = SEED.length + 1;

function crearNotificacionSimulada(): NotificacionTarjeta {
  const id = `n${nextId++}`;
  return {
    id,
    titulo: 'Notificación de prueba generada',
    detalle: 'Simulación de la capacidad de notificación de tarjetas.',
    tarjeta: '**** 2026',
    tipo: 'pago',
    estado: 'no-leida',
    fecha: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
}

type Filtro = 'todas' | Estado;

export default function App() {
  const [notificaciones, setNotificaciones] = useState<NotificacionTarjeta[]>(SEED);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [pendienteBorrar, setPendienteBorrar] = useState<NotificacionTarjeta | null>(null);
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [capacidadProbada, setCapacidadProbada] = useState(false);

  const noLeidas = notificaciones.filter((n) => n.estado === 'no-leida').length;

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return notificaciones.filter((n) => {
      const coincideFiltro = filtro === 'todas' || n.estado === filtro;
      const coincideTexto =
        texto === '' ||
        n.titulo.toLowerCase().includes(texto) ||
        n.detalle.toLowerCase().includes(texto) ||
        n.tarjeta.toLowerCase().includes(texto) ||
        TIPO_LABEL[n.tipo].toLowerCase().includes(texto);
      return coincideFiltro && coincideTexto;
    });
  }, [notificaciones, busqueda, filtro]);

  function marcarLeida(id: string) {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, estado: 'leida' as Estado } : n))
    );
    setMensajeEstado('Notificación marcada como leída.');
  }

  function marcarNoLeida(id: string) {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, estado: 'no-leida' as Estado } : n))
    );
    setMensajeEstado('Notificación marcada como no leída.');
  }

  function pedirConfirmacionBorrado(n: NotificacionTarjeta) {
    setPendienteBorrar(n);
  }

  function confirmarBorrado() {
    if (!pendienteBorrar) return;
    setNotificaciones((prev) => prev.filter((n) => n.id !== pendienteBorrar.id));
    setMensajeEstado(`Notificación "${pendienteBorrar.titulo}" eliminada.`);
    setPendienteBorrar(null);
  }

  function cancelarBorrado() {
    setPendienteBorrar(null);
  }

  function agregarSimulada() {
    const nueva = crearNotificacionSimulada();
    setNotificaciones((prev) => [nueva, ...prev]);
    setMensajeEstado('Se agregó una notificación simulada de tarjeta.');
  }

  function probarCapacidad() {
    setCapacidadProbada(true);
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Banca por Internet · Tarjetas</p>
          <h1>Notificación de Tarjetas</h1>
          <p className="subtitle">
            Centro de notificaciones ficticio para alertas de tus tarjetas: pagos, bloqueos,
            fraude y límite de crédito.
          </p>
        </div>
        <div className="badge-count" aria-label={`${noLeidas} notificaciones sin leer`}>
          <span className="badge-count-number">{noLeidas}</span>
          <span className="badge-count-label">sin leer</span>
        </div>
      </header>

      <section className="demo-capacidad" aria-label="Probar capacidad de notificación">
        <button type="button" className="btn btn-primary" onClick={probarCapacidad}>
          Probar capacidad
        </button>
        {capacidadProbada && (
          <p role="status" className="demo-status">
            Notificación de Tarjetas
          </p>
        )}
      </section>

      <section className="toolbar" aria-label="Buscar y filtrar notificaciones">
        <div className="field">
          <label htmlFor="buscador">Buscar</label>
          <input
            id="buscador"
            type="search"
            placeholder="Título, tarjeta, tipo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="filtro-estado">Estado</label>
          <select
            id="filtro-estado"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as Filtro)}
          >
            <option value="todas">Todas</option>
            <option value="no-leida">No leídas</option>
            <option value="leida">Leídas</option>
          </select>
        </div>
        <button type="button" className="btn btn-secondary" onClick={agregarSimulada}>
          + Simular notificación
        </button>
      </section>

      {mensajeEstado && (
        <p role="status" className="toolbar-status">
          {mensajeEstado}
        </p>
      )}

      {visibles.length === 0 ? (
        <p className="empty-state">No hay notificaciones que coincidan con la búsqueda.</p>
      ) : (
        <ul className="notif-list">
          {visibles.map((n) => (
            <li key={n.id} className={`notif-card notif-${n.estado}`}>
              <div className="notif-main">
                <div className="notif-top">
                  <span className={`chip chip-${n.tipo}`}>{TIPO_LABEL[n.tipo]}</span>
                  {n.estado === 'no-leida' && <span className="dot-nueva" aria-hidden="true" />}
                </div>
                <h2 className="notif-titulo">{n.titulo}</h2>
                <p className="notif-detalle">{n.detalle}</p>
                <p className="notif-meta">
                  Tarjeta {n.tarjeta} · {n.fecha}
                </p>
              </div>
              <div className="notif-actions">
                {n.estado === 'no-leida' ? (
                  <button type="button" className="btn btn-ghost" onClick={() => marcarLeida(n.id)}>
                    Marcar leída
                  </button>
                ) : (
                  <button type="button" className="btn btn-ghost" onClick={() => marcarNoLeida(n.id)}>
                    Marcar no leída
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => pedirConfirmacionBorrado(n)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pendienteBorrar && (
        <div className="overlay" role="presentation">
          <div
            className="confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-desc"
          >
            <h2 id="confirm-title">Eliminar notificación</h2>
            <p id="confirm-desc">
              ¿Seguro que deseas eliminar "{pendienteBorrar.titulo}"? Esta acción no se puede
              deshacer.
            </p>
            <div className="confirm-actions">
              <button type="button" className="btn btn-secondary" onClick={cancelarBorrado}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmarBorrado}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
