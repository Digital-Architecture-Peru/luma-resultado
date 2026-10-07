import { useMemo, useState } from 'react';

type Account = {
  id: string;
  name: string;
  owner: string;
  balance: number;
};

type TxType = 'deposito' | 'retiro' | 'transferencia';

type Transaction = {
  id: string;
  accountId: string;
  targetAccountId?: string;
  type: TxType;
  amount: number;
  description: string;
  date: string;
};

const TX_LABEL: Record<TxType, string> = {
  deposito: 'Depósito',
  retiro: 'Retiro',
  transferencia: 'Transferencia',
};

const initialAccounts: Account[] = [
  { id: 'acc-1', name: 'Cuenta Corriente', owner: 'María López', balance: 125000 },
  { id: 'acc-2', name: 'Cuenta Ahorros', owner: 'María López', balance: 48000 },
  { id: 'acc-3', name: 'Cuenta Nómina', owner: 'Carlos Ruiz', balance: 32000 },
];

const initialTransactions: Transaction[] = [
  { id: 'tx-1', accountId: 'acc-1', type: 'deposito', amount: 50000, description: 'Depósito inicial', date: '2026-09-28' },
  { id: 'tx-2', accountId: 'acc-2', type: 'retiro', amount: 2000, description: 'Retiro cajero', date: '2026-10-01' },
];

function formatCurrency(value: number): string {
  return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
}

type PendingTx = {
  accountId: string;
  targetAccountId: string;
  type: TxType;
  amount: number;
  description: string;
};

export default function App() {
  const [capabilityStatus, setCapabilityStatus] = useState('');
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const [accountId, setAccountId] = useState(initialAccounts[0].id);
  const [targetAccountId, setTargetAccountId] = useState(initialAccounts[1].id);
  const [type, setType] = useState<TxType>('deposito');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  const [pending, setPending] = useState<PendingTx | null>(null);
  const [deletePendingId, setDeletePendingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const filteredTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();
    return transactions
      .filter((tx) => {
        if (!term) return true;
        const acc = accounts.find((a) => a.id === tx.accountId);
        return (
          tx.description.toLowerCase().includes(term) ||
          TX_LABEL[tx.type].toLowerCase().includes(term) ||
          (acc ? acc.name.toLowerCase().includes(term) : false)
        );
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [transactions, search, accounts]);

  function handleProbarCapacidad() {
    setCapabilityStatus('Transacción de Cuentas');
  }

  function validateDraft(): string {
    const value = Number(amount);
    if (!amount || Number.isNaN(value) || value <= 0) {
      return 'Ingresa un monto válido mayor que cero.';
    }
    const source = accounts.find((a) => a.id === accountId);
    if (!source) return 'Selecciona una cuenta de origen válida.';
    if (type === 'transferencia' && accountId === targetAccountId) {
      return 'La cuenta destino debe ser distinta de la de origen.';
    }
    if ((type === 'retiro' || type === 'transferencia') && value > source.balance) {
      return 'Saldo insuficiente en la cuenta de origen.';
    }
    if (!description.trim()) {
      return 'Describe brevemente la transacción.';
    }
    return '';
  }

  function handleSubmitDraft(e: React.FormEvent) {
    e.preventDefault();
    const error = validateDraft();
    if (error) {
      setFormError(error);
      setFormMessage('');
      return;
    }
    setFormError('');
    setPending({
      accountId,
      targetAccountId,
      type,
      amount: Number(amount),
      description: description.trim(),
    });
  }

  function confirmPending() {
    if (!pending) return;
    const { accountId: fromId, targetAccountId: toId, type: txType, amount: value, description: desc } = pending;

    setAccounts((prev) =>
      prev.map((acc) => {
        if (txType === 'deposito' && acc.id === fromId) {
          return { ...acc, balance: acc.balance + value };
        }
        if (txType === 'retiro' && acc.id === fromId) {
          return { ...acc, balance: acc.balance - value };
        }
        if (txType === 'transferencia') {
          if (acc.id === fromId) return { ...acc, balance: acc.balance - value };
          if (acc.id === toId) return { ...acc, balance: acc.balance + value };
        }
        return acc;
      })
    );

    const newTx: Transaction = {
      id: genId('tx'),
      accountId: fromId,
      targetAccountId: txType === 'transferencia' ? toId : undefined,
      type: txType,
      amount: value,
      description: desc,
      date: new Date().toISOString().slice(0, 10),
    };
    setTransactions((prev) => [newTx, ...prev]);
    setPending(null);
    setAmount('');
    setDescription('');
    setFormMessage(`${TX_LABEL[txType]} registrada por ${formatCurrency(value)}.`);
  }

  function cancelPending() {
    setPending(null);
  }

  function requestDelete(id: string) {
    setDeletePendingId(id);
  }

  function confirmDelete() {
    if (!deletePendingId) return;
    const tx = transactions.find((t) => t.id === deletePendingId);
    if (tx) {
      setAccounts((prev) =>
        prev.map((acc) => {
          if (tx.type === 'deposito' && acc.id === tx.accountId) {
            return { ...acc, balance: acc.balance - tx.amount };
          }
          if (tx.type === 'retiro' && acc.id === tx.accountId) {
            return { ...acc, balance: acc.balance + tx.amount };
          }
          if (tx.type === 'transferencia') {
            if (acc.id === tx.accountId) return { ...acc, balance: acc.balance + tx.amount };
            if (acc.id === tx.targetAccountId) return { ...acc, balance: acc.balance - tx.amount };
          }
          return acc;
        })
      );
      setTransactions((prev) => prev.filter((t) => t.id !== deletePendingId));
      setFormMessage('Transacción eliminada y saldo revertido.');
    }
    setDeletePendingId(null);
  }

  function cancelDelete() {
    setDeletePendingId(null);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Banca por Internet · Cuentas</p>
          <h1>Transacción de Cuentas</h1>
          <p className="subtitle">Registra depósitos, retiros y transferencias entre cuentas ficticias.</p>
        </div>
        <div className="capability-block">
          <button type="button" className="btn btn-primary" onClick={handleProbarCapacidad}>
            Probar capacidad
          </button>
          <p role="status" className="capability-status">
            {capabilityStatus}
          </p>
        </div>
      </header>

      <section className="accounts-grid" aria-label="Resumen de cuentas">
        {accounts.map((acc) => (
          <article key={acc.id} className="card account-card">
            <h2>{acc.name}</h2>
            <p className="muted">{acc.owner}</p>
            <p className="balance">{formatCurrency(acc.balance)}</p>
          </article>
        ))}
      </section>

      <section className="card form-card" aria-labelledby="form-title">
        <h2 id="form-title">Nueva transacción</h2>
        <form onSubmit={handleSubmitDraft} className="tx-form" noValidate>
          <div className="field">
            <label htmlFor="accountId">Cuenta de origen</label>
            <select id="accountId" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} — {formatCurrency(acc.balance)}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="type">Tipo de transacción</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as TxType)}>
              <option value="deposito">Depósito</option>
              <option value="retiro">Retiro</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          {type === 'transferencia' && (
            <div className="field">
              <label htmlFor="targetAccountId">Cuenta destino</label>
              <select id="targetAccountId" value={targetAccountId} onChange={(e) => setTargetAccountId(e.target.value)}>
                {accounts
                  .filter((acc) => acc.id !== accountId)
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="field">
            <label htmlFor="amount">Monto</label>
            <input
              id="amount"
              type="number"
              min="0"
              step="1000"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="field field-wide">
            <label htmlFor="description">Descripción</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Motivo de la transacción"
            />
          </div>

          {formError && (
            <p role="alert" className="form-error">
              {formError}
            </p>
          )}

          <div className="field field-actions">
            <button type="submit" className="btn btn-primary">
              Revisar transacción
            </button>
          </div>
        </form>

        {formMessage && (
          <p role="status" className="form-message">
            {formMessage}
          </p>
        )}

        {pending && (
          <div className="confirm-panel" role="alertdialog" aria-labelledby="confirm-title">
            <h3 id="confirm-title">Confirmar {TX_LABEL[pending.type].toLowerCase()}</h3>
            <p>
              {TX_LABEL[pending.type]} de {formatCurrency(pending.amount)} en{' '}
              {accounts.find((a) => a.id === pending.accountId)?.name}
              {pending.type === 'transferencia'
                ? ` hacia ${accounts.find((a) => a.id === pending.targetAccountId)?.name}`
                : ''}
              . Descripción: {pending.description}
            </p>
            <div className="confirm-actions">
              <button type="button" className="btn btn-primary" onClick={confirmPending}>
                Confirmar
              </button>
              <button type="button" className="btn btn-ghost" onClick={cancelPending}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="card list-card" aria-labelledby="list-title">
        <div className="list-header">
          <h2 id="list-title">Historial de transacciones</h2>
          <div className="field search-field">
            <label htmlFor="search">Buscar</label>
            <input
              id="search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cuenta, tipo o descripción"
            />
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <p className="empty-state">No hay transacciones que coincidan con la búsqueda.</p>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cuenta</th>
                <th>Tipo</th>
                <th className="num">Monto</th>
                <th>Descripción</th>
                <th aria-label="Acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => {
                const acc = accounts.find((a) => a.id === tx.accountId);
                return (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td>{acc ? acc.name : '—'}</td>
                    <td>{TX_LABEL[tx.type]}</td>
                    <td className="num">{formatCurrency(tx.amount)}</td>
                    <td>{tx.description}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => requestDelete(tx.id)}
                        aria-label={`Eliminar transacción ${tx.description}`}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {deletePendingId && (
          <div className="confirm-panel" role="alertdialog" aria-labelledby="delete-title">
            <h3 id="delete-title">Confirmar eliminación</h3>
            <p>Esta acción revertirá el saldo afectado. ¿Deseas continuar?</p>
            <div className="confirm-actions">
              <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                Eliminar
              </button>
              <button type="button" className="btn btn-ghost" onClick={cancelDelete}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
