import { useMemo, useState } from 'react';

// ---------------------------------------------------------------------------
// entities/account — datos ficticios y funciones puras de dominio
// ---------------------------------------------------------------------------
type AccountType = 'ahorros' | 'corriente';

interface Account {
  id: string;
  alias: string;
  type: AccountType;
  number: string;
  currency: string;
  balance: number;
}

function getAccounts(): Account[] {
  return [
    { id: 'acc-1', alias: 'Cuenta Principal', type: 'ahorros', number: '4001234567894321', currency: 'USD', balance: 3250.75 },
    { id: 'acc-2', alias: 'Fondo de Emergencia', type: 'ahorros', number: '4009988776655443', currency: 'USD', balance: 12500.0 },
    { id: 'acc-3', alias: 'Gastos del Hogar', type: 'corriente', number: '5102233445566778', currency: 'USD', balance: 870.2 },
    { id: 'acc-4', alias: 'Negocio Personal', type: 'corriente', number: '5109876543210987', currency: 'USD', balance: 15430.9 },
  ];
}

function maskAccountNumber(number: string): string {
  const last4 = number.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

function formatBalance(balance: number, currency: string): string {
  return new Intl.NumberFormat('es-EC', { style: 'currency', currency }).format(balance);
}

function filterAccounts(accounts: Account[], type: AccountType | 'todas', query: string): Account[] {
  const normalizedQuery = query.trim().toLowerCase();
  return accounts.filter((account) => {
    const matchesType = type === 'todas' || account.type === type;
    const matchesQuery = normalizedQuery === '' || account.alias.toLowerCase().includes(normalizedQuery);
    return matchesType && matchesQuery;
  });
}

// ---------------------------------------------------------------------------
// widgets/account-detail — panel de solo lectura
// ---------------------------------------------------------------------------
function AccountDetail({ account }: { account: Account | null }) {
  if (!account) {
    return (
      <aside className="detail-panel detail-panel--empty" aria-labelledby="detail-heading">
        <h2 id="detail-heading">Detalle de la cuenta</h2>
        <p>Selecciona una cuenta de la lista para ver su detalle.</p>
      </aside>
    );
  }
  return (
    <aside className="detail-panel" aria-labelledby="detail-heading">
      <h2 id="detail-heading">Detalle de la cuenta</h2>
      <dl className="detail-list">
        <dt>Alias</dt>
        <dd>{account.alias}</dd>
        <dt>Tipo</dt>
        <dd className="capitalize">{account.type}</dd>
        <dt>Número</dt>
        <dd>{maskAccountNumber(account.number)}</dd>
        <dt>Moneda</dt>
        <dd>{account.currency}</dd>
        <dt>Saldo disponible</dt>
        <dd className="balance">{formatBalance(account.balance, account.currency)}</dd>
      </dl>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// features/filter-accounts — filtro por tipo y búsqueda por alias
// ---------------------------------------------------------------------------
function AccountFilters({
  typeFilter,
  onTypeFilterChange,
  query,
  onQueryChange,
}: {
  typeFilter: AccountType | 'todas';
  onTypeFilterChange: (value: AccountType | 'todas') => void;
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <form className="filters" role="search" aria-label="Filtrar cuentas" onSubmit={(e) => e.preventDefault()}>
      <div className="field">
        <label htmlFor="type-filter">Tipo de cuenta</label>
        <select
          id="type-filter"
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value as AccountType | 'todas')}
        >
          <option value="todas">Todas</option>
          <option value="ahorros">Ahorros</option>
          <option value="corriente">Corriente</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="alias-search">Buscar por alias</label>
        <input
          id="alias-search"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Ej. Principal"
        />
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// widgets/account-list — listado seleccionable
// ---------------------------------------------------------------------------
function AccountList({
  accounts,
  selectedId,
  onSelect,
}: {
  accounts: Account[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (accounts.length === 0) {
    return <p className="empty-state">No se encontraron cuentas con esos criterios.</p>;
  }
  return (
    <ul className="account-list" aria-label="Lista de cuentas">
      {accounts.map((account) => {
        const isSelected = account.id === selectedId;
        return (
          <li key={account.id}>
            <button
              type="button"
              className={`account-card${isSelected ? ' account-card--selected' : ''}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(account.id)}
            >
              <span className="account-alias">{account.alias}</span>
              <span className="account-meta">
                <span className="capitalize">{account.type}</span> · {maskAccountNumber(account.number)}
              </span>
              <span className="balance">{formatBalance(account.balance, account.currency)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// pages/account-query — composición de la página de consulta
// ---------------------------------------------------------------------------
function AccountQueryPage() {
  const accounts = useMemo(() => getAccounts(), []);
  const [typeFilter, setTypeFilter] = useState<AccountType | 'todas'>('todas');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(accounts[0]?.id ?? null);

  const filteredAccounts = useMemo(
    () => filterAccounts(accounts, typeFilter, query),
    [accounts, typeFilter, query]
  );

  const selectedAccount = useMemo(
    () => filteredAccounts.find((account) => account.id === selectedId) ?? null,
    [filteredAccounts, selectedId]
  );

  return (
    <section aria-labelledby="page-heading">
      <h1 id="page-heading">Consulta de Cuentas</h1>
      <p className="banner">Banca por Internet · Datos de demostración</p>

      <AccountFilters
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        query={query}
        onQueryChange={setQuery}
      />

      <div className="query-layout">
        <AccountList accounts={filteredAccounts} selectedId={selectedAccount?.id ?? null} onSelect={setSelectedId} />
        <AccountDetail account={selectedAccount} />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// app — raíz de la aplicación: capacidad de prueba + página de consulta
// ---------------------------------------------------------------------------
export default function App() {
  const [capabilityMessage, setCapabilityMessage] = useState<string | null>(null);

  function handleProbarCapacidad() {
    setCapabilityMessage('Consulta de Cuentas');
  }

  return (
    <main className="app-shell">
      <div className="capability-check">
        <button type="button" onClick={handleProbarCapacidad}>
          Probar capacidad
        </button>
        <p role="status" aria-live="polite" className="status-message">
          {capabilityMessage ?? ''}
        </p>
      </div>
      <AccountQueryPage />
    </main>
  );
}
