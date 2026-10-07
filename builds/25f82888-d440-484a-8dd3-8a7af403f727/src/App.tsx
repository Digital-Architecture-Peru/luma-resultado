import { useMemo, useState } from 'react';

/**
 * Consulta de Tarjetas · Banca por Internet
 * Capa: Frontend · Patrón: Component-based (Atomic Design, inline en un solo archivo)
 * Datos ficticios en memoria. Sin red, BD ni dependencias nuevas.
 */

type EstadoTarjeta = 'activa' | 'bloqueada' | 'vencida';
type TipoTarjeta = 'crédito' | 'débito';

interface Tarjeta {
  id: string;
  alias: string;
  marca: string;
  ultimos4: string;
  tipo: TipoTarjeta;
  estado: EstadoTarjeta;
  saldo: number;
  limite: number;
  vencimiento: string; // ISO yyyy-mm
  titular: string;
}

const TARJETAS_MOCK: Tarjeta[] = [
  {
    id: 'tj-001',
    alias: 'Tarjeta Principal',
    marca: 'Visa',
    ultimos4: '4821',
    tipo: 'crédito',
    estado: 'activa',
    saldo: 1250.75,
    limite: 5000,
    vencimiento: '2028-05',
    titular: 'Ana María Rodríguez',
  },
  {
    id: 'tj-002',
    alias: 'Tarjeta Nómina',
    marca: 'Mastercard',
    ultimos4: '1190',
    tipo: 'débito',
    estado: 'activa',
    saldo: 3890.2,
    limite: 3890.2,
    vencimiento: '2027-11',
    titular: 'Ana María Rodríguez',
  },
  {
    id: 'tj-003',
    alias: 'Tarjeta Respaldo',
    marca: 'Visa',
    ultimos4: '7734',
    tipo: 'crédito',
    estado: 'bloqueada',
    saldo: 0,
    limite: 2000,
    vencimiento: '2026-02',
    titular: 'Ana María Rodríguez',
  },
];

function formatMoneda(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD' }).format(valor);
}

function formatVencimiento(iso: string): string {
  const [anio, mes] = iso.split('-');
  const fecha = new Date(Number(anio), Number(mes) - 1, 1);
  return new Intl.DateTimeFormat('es-CO', { month: 'short', year: 'numeric' }).format(fecha);
}

function maskPan(ultimos4: string): string {
  return `•••• •••• •••• ${ultimos4}`;
}

function EstadoBadge({ estado }: { estado: EstadoTarjeta }) {
  const texto = estado === 'activa' ? 'Activa' : estado === 'bloqueada' ? 'Bloqueada' : 'Vencida';
  return (
    <span className={`a-badge a-badge--${estado}`}>
      <span aria-hidden="true" className="a-badge__dot" />
      {texto}
    </span>
  );
}

function CardSummary({
  tarjeta,
  seleccionada,
  onSeleccionar,
}: {
  tarjeta: Tarjeta;
  seleccionada: boolean;
  onSeleccionar: (id: string) => void;
}) {
  return (
    <li className="m-card-summary">
      <button
        type="button"
        className={`m-card-summary__button${seleccionada ? ' is-selected' : ''}`}
        aria-pressed={seleccionada}
        onClick={() => onSeleccionar(tarjeta.id)}
      >
        <span className="m-card-summary__top">
          <span className="m-card-summary__alias">{tarjeta.alias}</span>
          <EstadoBadge estado={tarjeta.estado} />
        </span>
        <span className="m-card-summary__pan">{maskPan(tarjeta.ultimos4)}</span>
        <span className="m-card-summary__meta">
          {tarjeta.marca} · {tarjeta.tipo}
        </span>
      </button>
    </li>
  );
}

function DetailRow({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="m-detail-row">
      <dt className="m-detail-row__label">{etiqueta}</dt>
      <dd className="m-detail-row__value">{valor}</dd>
    </div>
  );
}

function CardDetail({
  tarjeta,
  onBloquear,
  bloqueando,
}: {
  tarjeta: Tarjeta | null;
  onBloquear: (id: string) => void;
  bloqueando: boolean;
}) {
  if (!tarjeta) {
    return (
      <div className="o-card-detail o-card-detail--vacio">
        <p>Selecciona una tarjeta de la lista para ver el detalle.</p>
      </div>
    );
  }
  return (
    <div className="o-card-detail">
      <header className="o-card-detail__header">
        <h2 className="o-card-detail__titulo">{tarjeta.alias}</h2>
        <EstadoBadge estado={tarjeta.estado} />
      </header>
      <p className="o-card-detail__pan">{maskPan(tarjeta.ultimos4)}</p>
      <dl className="o-card-detail__grid">
        <DetailRow etiqueta="Titular" valor={tarjeta.titular} />
        <DetailRow etiqueta="Marca" valor={tarjeta.marca} />
        <DetailRow etiqueta="Tipo" valor={tarjeta.tipo === 'crédito' ? 'Crédito' : 'Débito'} />
        <DetailRow etiqueta="Vencimiento" valor={formatVencimiento(tarjeta.vencimiento)} />
        <DetailRow
          etiqueta={tarjeta.tipo === 'crédito' ? 'Saldo utilizado' : 'Saldo disponible'}
          valor={formatMoneda(tarjeta.saldo)}
        />
        <DetailRow etiqueta="Límite" valor={formatMoneda(tarjeta.limite)} />
      </dl>
      <button
        type="button"
        className="a-button a-button--peligro"
        disabled={tarjeta.estado === 'bloqueada' || bloqueando}
        onClick={() => onBloquear(tarjeta.id)}
      >
        {tarjeta.estado === 'bloqueada' ? 'Tarjeta bloqueada' : 'Bloquear tarjeta'}
      </button>
    </div>
  );
}

export default function App() {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>(TARJETAS_MOCK);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(TARJETAS_MOCK[0]?.id ?? null);
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [capacidadProbada, setCapacidadProbada] = useState(false);

  const tarjetasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return tarjetas;
    return tarjetas.filter((t) =>
      [t.alias, t.marca, t.ultimos4, t.tipo, t.estado].some((campo) =>
        campo.toLowerCase().includes(termino)
      )
    );
  }, [tarjetas, busqueda]);

  const tarjetaSeleccionada = useMemo(
    () => tarjetas.find((t) => t.id === seleccionadaId) ?? null,
    [tarjetas, seleccionadaId]
  );

  function handleSeleccionar(id: string) {
    setSeleccionadaId(id);
    setMensajeEstado('');
  }

  function solicitarBloqueo(id: string) {
    setConfirmando(id);
  }

  function confirmarBloqueo() {
    if (!confirmando) return;
    setTarjetas((prev) =>
      prev.map((t) => (t.id === confirmando ? { ...t, estado: 'bloqueada' as EstadoTarjeta } : t))
    );
    const tarjeta = tarjetas.find((t) => t.id === confirmando);
    setMensajeEstado(`Tarjeta ${tarjeta?.alias ?? ''} bloqueada correctamente.`);
    setConfirmando(null);
  }

  function cancelarBloqueo() {
    setConfirmando(null);
  }

  function handleProbarCapacidad() {
    setCapacidadProbada(true);
  }

  return (
    <main className="t-consulta-layout">
      <header className="t-consulta-layout__header">
        <h1>Consulta de Tarjetas</h1>
        <p className="t-consulta-layout__subtitulo">
          Banca por Internet · Frontend · Datos de demostración en memoria
        </p>
        <button type="button" className="a-button a-button--primario" onClick={handleProbarCapacidad}>
          Probar capacidad
        </button>
        <p role="status" className="a-status" aria-live="polite">
          {capacidadProbada ? 'Consulta de Tarjetas' : ''}
        </p>
      </header>

      <section className="o-buscador" aria-label="Buscar tarjetas">
        <label htmlFor="buscador-tarjetas" className="a-label">
          Buscar por alias, marca, últimos 4 dígitos, tipo o estado
        </label>
        <input
          id="buscador-tarjetas"
          type="search"
          className="a-input"
          placeholder="Ej: Visa, 4821, bloqueada…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </section>

      <div className="t-consulta-layout__cuerpo">
        <section aria-label="Lista de tarjetas" className="o-card-list">
          {tarjetasFiltradas.length === 0 ? (
            <p className="o-card-list__vacio">No se encontraron tarjetas con ese criterio.</p>
          ) : (
            <ul className="o-card-list__ul">
              {tarjetasFiltradas.map((t) => (
                <CardSummary
                  key={t.id}
                  tarjeta={t}
                  seleccionada={t.id === seleccionadaId}
                  onSeleccionar={handleSeleccionar}
                />
              ))}
            </ul>
          )}
        </section>

        <section aria-label="Detalle de la tarjeta" className="o-card-detail-section">
          <CardDetail
            tarjeta={tarjetaSeleccionada}
            onBloquear={solicitarBloqueo}
            bloqueando={confirmando !== null}
          />
          <p role="status" className="a-status" aria-live="polite">
            {mensajeEstado}
          </p>
        </section>
      </div>

      {confirmando && (
        <div className="o-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-titulo">
          <div className="o-confirm-dialog__caja">
            <h2 id="confirm-titulo">Confirmar bloqueo</h2>
            <p>¿Deseas bloquear esta tarjeta? Esta acción es simulada y puede revertirse recargando la página.</p>
            <div className="o-confirm-dialog__acciones">
              <button type="button" className="a-button a-button--secundario" onClick={cancelarBloqueo}>
                Cancelar
              </button>
              <button type="button" className="a-button a-button--peligro" onClick={confirmarBloqueo}>
                Sí, bloquear
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
