import { useMemo, useState } from 'react';

type CardStatus = 'activa' | 'bloqueada';

interface CardRecord {
  id: string;
  holder: string;
  last4: string;
  pan: string;
  brand: 'Visa' | 'Mastercard';
  status: CardStatus;
  limit: number;
  balance: number;
  dueDate: string;
}

const MOCK_CARDS: CardRecord[] = [
  {
    id: 'c1',
    holder: 'Ana Gómez',
    last4: '4821',
    pan: '•••• •••• •••• 4821',
    brand: 'Visa',
    status: 'activa',
    limit: 8000000,
    balance: 1250000,
    dueDate: '2026-11-05',
  },
  {
    id: 'c2',
    holder: 'Carlos Ruiz',
    last4: '1190',
    pan: '•••• •••• •••• 1190',
    brand: 'Mastercard',
    status: 'activa',
    limit: 5000000,
    balance: 4875000,
    dueDate: '2026-10-28',
  },
  {
    id: 'c3',
    holder: 'Marta López',
    last4: '7734',
    pan: '•••• •••• •••• 7734',
    brand: 'Visa',
    status: 'bloqueada',
    limit: 3000000,
    balance: 0,
    dueDate: '2026-11-12',
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tryStatus, setTryStatus] = useState<'idle' | 'simulated'>('idle');

  const filteredCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_CARDS;
    return MOCK_CARDS.filter(
      (c) =>
        c.holder.toLowerCase().includes(q) ||
        c.last4.includes(q) ||
        c.brand.toLowerCase().includes(q),
    );
  }, [query]);

  const selectedCard = useMemo(
    () => MOCK_CARDS.find((c) => c.id === selectedId) ?? null,
    [selectedId],
  );

  function handleTryCapability() {
    setTryStatus('simulated');
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Consulta de Tarjetas</h1>
        <p className="app-subtitle">
          Banca por Internet · Tarjetas · datos ficticios en memoria
        </p>
      </header>

      <section className="panel" aria-labelledby="try-capability-heading">
        <h2 id="try-capability-heading" className="visually-hidden">
          Probar capacidad
        </h2>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleTryCapability}
        >
          Probar capacidad
        </button>
        <p role="status" aria-live="polite" className="status-text">
          {tryStatus === 'simulated' ? 'Consulta de Tarjetas' : ''}
        </p>
      </section>

      <section className="panel" aria-labelledby="search-heading">
        <h2 id="search-heading">Buscar tarjeta</h2>
        <label htmlFor="card-search" className="field-label">
          Nombre, últimos 4 dígitos o marca
        </label>
        <input
          id="card-search"
          type="search"
          className="text-input"
          placeholder="Ej. Ana, 4821, Visa"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="hint-text" aria-live="polite">
          {filteredCards.length} resultado(s)
        </p>
      </section>

      <section className="panel" aria-labelledby="list-heading">
        <h2 id="list-heading">Tarjetas</h2>
        {filteredCards.length === 0 ? (
          <p className="empty-state">No se encontraron tarjetas con ese criterio.</p>
        ) : (
          <ul className="card-list">
            {filteredCards.map((card) => {
              const isSelected = card.id === selectedId;
              return (
                <li key={card.id}>
                  <button
                    type="button"
                    className={
                      'card-item' + (isSelected ? ' card-item-selected' : '')
                    }
                    aria-pressed={isSelected}
                    onClick={() => setSelectedId(card.id)}
                  >
                    <span className="card-item-main">
                      <strong>{card.holder}</strong>
                      <span>{card.brand} · {card.pan}</span>
                    </span>
                    <span
                      className={
                        'badge ' +
                        (card.status === 'activa' ? 'badge-ok' : 'badge-blocked')
                      }
                    >
                      {card.status === 'activa' ? 'Activa' : 'Bloqueada'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="panel" aria-labelledby="detail-heading">
        <h2 id="detail-heading">Detalle de la tarjeta</h2>
        {selectedCard ? (
          <dl className="detail-grid">
            <div>
              <dt>Titular</dt>
              <dd>{selectedCard.holder}</dd>
            </div>
            <div>
              <dt>Número</dt>
              <dd>{selectedCard.pan}</dd>
            </div>
            <div>
              <dt>Marca</dt>
              <dd>{selectedCard.brand}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{selectedCard.status === 'activa' ? 'Activa' : 'Bloqueada'}</dd>
            </div>
            <div>
              <dt>Cupo</dt>
              <dd>{formatCurrency(selectedCard.limit)}</dd>
            </div>
            <div>
              <dt>Saldo actual</dt>
              <dd>{formatCurrency(selectedCard.balance)}</dd>
            </div>
            <div>
              <dt>Fecha de corte</dt>
              <dd>{formatDate(selectedCard.dueDate)}</dd>
            </div>
          </dl>
        ) : (
          <p className="empty-state">
            Selecciona una tarjeta de la lista para ver su detalle.
          </p>
        )}
      </section>

      <p className="disclaimer">
        Datos ficticios en memoria. Sin persistencia, red ni integración real.
      </p>
    </main>
  );
}
