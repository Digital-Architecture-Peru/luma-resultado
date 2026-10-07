import { useMemo, useState } from 'react';

/**
 * Consulta de Tarjetas · Banca por Internet
 * Patrón: Component-based (Atomic Design), implementado dentro de este único
 * archivo porque el perfil local-bounded solo autoriza src/App.tsx y
 * src/styles.css. La jerarquía atoms/molecules/organisms se documenta con
 * comentarios y nombres de componente.
 *
 * Datos ficticios en memoria. Sin red, sin BD, sin localStorage.
 */

type TarjetaTipo = 'Crédito' | 'Débito';

interface Tarjeta {
  id: string;
  alias: string;
  last4: string;
  tipo: TarjetaTipo;
  moneda: string;
  limite: number;
  disponible: number;
  fechaCorte: string; // ISO yyyy-mm-dd
  titular: string;
}

// ---------------------------------------------------------------------------
// data/mockCards.ts (inline) — fuente de solo lectura
// ---------------------------------------------------------------------------
const MOCK_TARJETAS: Tarjeta[] = [
  {
    id: 'c-1001',
    alias: 'Tarjeta Principal',
    last4: '4821',
    tipo: 'Crédito',
    moneda: 'USD',
    limite: 5000,
    disponible: 3120.5,
    fechaCorte: '2026-10-28',
    titular: 'Ana Gómez',
  },
  {
    id: 'c-1002',
    alias: 'Tarjeta Nómina',
    last4: '7734',
    tipo: 'Débito',
    moneda: 'USD',
    limite: 0,
    disponible: 980.25,
    fechaCorte: '2026-10-05',
    titular: 'Ana Gómez',
  },
  {
    id: 'c-1003',
    alias: 'Tarjeta Viajes',
    last4: '2290',
    tipo: 'Crédito',
    moneda: 'USD',
    limite: 8000,
    disponible: 450.0,
    fechaCorte: '2026-10-15',
    titular: 'Ana Gómez',
  },
];

// ---------------------------------------------------------------------------
// domain/cards.ts (inline) — funciones puras, testeables sin DOM
// ---------------------------------------------------------------------------
function maskPan(last4: string): string {
  return `•••• •••• •••• ${last4}`;
}

function formatAmount(valor: number, moneda: string): string {
  try {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: moneda }).format(valor);
  } catch {
    return `${valor.toFixed(2)} ${moneda}`;
  }
}

function formatFecha(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(
      new Date(`${iso}T00:00:00`),
    );
  } catch {
    return iso;
  }
}

function usagePercent(tarjeta: Tarjeta): number {
  if (tarjeta.tipo !== 'Crédito' || tarjeta.limite <= 0) return 0;
  const usado = tarjeta.limite - tarjeta.disponible;
  return Math.max(0, Math.min(100, Math.round((usado / tarjeta.limite) * 100)));
}

function buscarTarjetas(tarjetas: Tarjeta[], termino: string): Tarjeta[] {
  const q = termino.trim().toLowerCase();
  if (!q) return tarjetas;
  return tarjetas.filter(
    (t) =>
      t.alias.toLowerCase().includes(q) ||
      t.last4.includes(q) ||
      t.tipo.toLowerCase().includes(q),
  );
}

// ---------------------------------------------------------------------------
// atoms
// ---------------------------------------------------------------------------
function Badge({ tipo }: { tipo: TarjetaTipo }) {
  return <span className={`badge badge--${tipo === 'Crédito' ? 'credito' : 'debito'}`}>{tipo}</span>;
}

function Amount({ valor, moneda }: { valor: number; moneda: string }) {
  return <span className="amount">{formatAmount(valor, moneda)}</span>;
}

// ---------------------------------------------------------------------------
// molecules
// ---------------------------------------------------------------------------
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
    <li>
      <button
        type="button"
        className={`card-summary${seleccionada ? ' card-summary--activa' : ''}`}
        onClick={() => onSeleccionar(tarjeta.id)}
        aria-pressed={seleccionada}
      >
        <div className="card-summary__fila">
          <span className="card-summary__alias">{tarjeta.alias}</span>
          <Badge tipo={tarjeta.tipo} />
        </div>
        <div className="card-summary__pan">{maskPan(tarjeta.last4)}</div>
        <div className="card-summary__fila">
          <span className="card-summary__etiqueta">Disponible</span>
          <Amount valor={tarjeta.disponible} moneda={tarjeta.moneda} />
        </div>
      </button>
    </li>
  );
}

// ---------------------------------------------------------------------------
// organisms
// ---------------------------------------------------------------------------
function CardList({
  tarjetas,
  idSeleccionado,
  onSeleccionar,
}: {
  tarjetas: Tarjeta[];
  idSeleccionado: string | null;
  onSeleccionar: (id: string) => void;
}) {
  if (tarjetas.length === 0) {
    return <p className="estado-vacio">No hay tarjetas que coincidan con la búsqueda.</p>;
  }
  return (
    <ul className="card-list">
      {tarjetas.map((t) => (
        <CardSummary
          key={t.id}
          tarjeta={t}
          seleccionada={t.id === idSeleccionado}
          onSeleccionar={onSeleccionar}
        />
      ))}
    </ul>
  );
}

function CardDetail({ tarjeta }: { tarjeta: Tarjeta | null }) {
  if (!tarjeta) {
    return (
      <div className="card-detail card-detail--vacio">
        <p>Selecciona una tarjeta de la lista para ver el detalle.</p>
      </div>
    );
  }
  const uso = usagePercent(tarjeta);
  return (
    <div className="card-detail" aria-labelledby="detalle-titulo">
      <div className="card-detail__encabezado">
        <h2 id="detalle-titulo">{tarjeta.alias}</h2>
        <Badge tipo={tarjeta.tipo} />
      </div>
      <p className="card-detail__pan">{maskPan(tarjeta.last4)}</p>
      <dl className="card-detail__grid">
        <div>
          <dt>Titular</dt>
          <dd>{tarjeta.titular}</dd>
        </div>
        <div>
          <dt>Disponible</dt>
          <dd>
            <Amount valor={tarjeta.disponible} moneda={tarjeta.moneda} />
          </dd>
        </div>
        {tarjeta.tipo === 'Crédito' && (
          <div>
            <dt>Límite</dt>
            <dd>
              <Amount valor={tarjeta.limite} moneda={tarjeta.moneda} />
            </dd>
          </div>
        )}
        <div>
          <dt>Fecha de corte</dt>
          <dd>{formatFecha(tarjeta.fechaCorte)}</dd>
        </div>
      </dl>
      {tarjeta.tipo === 'Crédito' && (
        <div className="card-detail__uso" role="group" aria-label="Uso del límite de crédito">
          <div className="barra-uso">
            <div className="barra-uso__relleno" style={{ width: `${uso}%` }} />
          </div>
          <span className="barra-uso__texto">{uso}% del límite utilizado</span>
        </div>
      )}
    </div>
  );
}

function CapabilityProbe({ onProbar, mensaje }: { onProbar: () => void; mensaje: string | null }) {
  return (
    <div className="capability-probe">
      <button type="button" className="btn btn--primario" onClick={onProbar}>
        Probar capacidad
      </button>
      <p className="capability-probe__status" role="status">
        {mensaje}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// template/page
// ---------------------------------------------------------------------------
export default function App() {
  const [termino, setTermino] = useState('');
  const [idSeleccionado, setIdSeleccionado] = useState<string | null>(MOCK_TARJETAS[0]?.id ?? null);
  const [mensajeCapacidad, setMensajeCapacidad] = useState<string | null>(null);

  const resultados = useMemo(() => buscarTarjetas(MOCK_TARJETAS, termino), [termino]);
  const tarjetaSeleccionada = useMemo(
    () => resultados.find((t) => t.id === idSeleccionado) ?? resultados[0] ?? null,
    [resultados, idSeleccionado],
  );

  function manejarProbarCapacidad() {
    setMensajeCapacidad('Consulta de Tarjetas');
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1>Consulta de Tarjetas</h1>
        <p className="app__subtitulo">Banca por Internet · datos ficticios en memoria, sin persistencia</p>
      </header>

      <CapabilityProbe onProbar={manejarProbarCapacidad} mensaje={mensajeCapacidad} />

      <section className="app__contenido" aria-label="Consulta de tarjetas">
        <div className="app__panel">
          <label htmlFor="buscador-tarjetas" className="campo__etiqueta">
            Buscar por alias, tipo o últimos 4 dígitos
          </label>
          <input
            id="buscador-tarjetas"
            type="search"
            className="campo__input"
            placeholder="Ej.: viajes, crédito, 4821"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
          />
          <CardList tarjetas={resultados} idSeleccionado={tarjetaSeleccionada?.id ?? null} onSeleccionar={setIdSeleccionado} />
        </div>
        <div className="app__panel">
          <CardDetail tarjeta={tarjetaSeleccionada} />
        </div>
      </section>
    </main>
  );
}
