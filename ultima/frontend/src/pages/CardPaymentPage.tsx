import { useCallback, useEffect, useRef, useState } from 'react';
import { BankLayout } from '../components/templates/BankLayout';
import { CardSummary } from '../components/molecules/CardSummary';
import { PaymentForm } from '../components/organisms/PaymentForm';
import { TransactionList } from '../components/organisms/TransactionList';
import { ApiError } from '../services/cardsApi';
import type { CardsApi } from '../services/cardsApi';
import type { Account, Card, Transaction } from '../types';

interface CardPaymentPageProps {
  api: CardsApi;
}

export function CardPaymentPage({ api }: CardPaymentPageProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Se conserva hasta que el pago se registra, para que un reintento sea idempotente.
  const idempotencyKey = useRef<string | null>(null);

  const reload = useCallback(async () => {
    const [loadedCards, loadedAccounts] = await Promise.all([api.listCards(), api.listAccounts()]);
    setCards(loadedCards);
    setAccounts(loadedAccounts);
    setSelectedId((current) => current ?? loadedCards[0]?.id ?? null);
  }, [api]);

  useEffect(() => {
    reload()
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'No se pudo cargar la información'))
      .finally(() => setLoading(false));
  }, [reload]);

  useEffect(() => {
    if (!selectedId) return;
    api
      .listTransactions(selectedId)
      .then((page) => setTransactions(page.items))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'No se pudieron cargar los movimientos'));
  }, [api, selectedId]);

  const selected = cards.find((c) => c.id === selectedId) ?? null;

  async function handlePay(accountId: string, amount: string) {
    if (!selected) return;
    idempotencyKey.current ??= crypto.randomUUID();
    try {
      await api.payCard(selected.id, accountId, amount, idempotencyKey.current);
    } catch (e) {
      if (e instanceof ApiError && (e.status === 400 || e.status === 422)) {
        idempotencyKey.current = null;
      }
      throw e;
    }
    idempotencyKey.current = null;
    await reload();
    setTransactions((await api.listTransactions(selected.id)).items);
  }

  return (
    <BankLayout title="Pago de tarjetas">
      {loading ? <p role="status">Cargando…</p> : null}
      {error ? <p className="feedback feedback--error" role="alert">{error}</p> : null}
      {!loading && cards.length === 0 && !error ? <p className="muted">No tiene tarjetas registradas.</p> : null}
      <section className="card-list" aria-label="Mis tarjetas">
        {cards.map((c) => (
          <CardSummary key={c.id} card={c} selected={c.id === selectedId} onSelect={setSelectedId} />
        ))}
      </section>
      {selected ? (
        <>
          <PaymentForm key={selected.id} card={selected} accounts={accounts} onSubmit={handlePay} />
          <section className="panel">
            <h2>Movimientos</h2>
            <TransactionList transactions={transactions} />
          </section>
        </>
      ) : null}
    </BankLayout>
  );
}
