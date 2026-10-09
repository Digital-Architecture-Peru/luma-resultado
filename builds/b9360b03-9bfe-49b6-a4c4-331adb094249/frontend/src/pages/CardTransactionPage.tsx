import { useCallback, useEffect, useRef, useState } from 'react';
import { PaymentForm } from '../components/organisms/PaymentForm';
import { TransactionList } from '../components/organisms/TransactionList';
import { PageTemplate } from '../components/templates/PageTemplate';
import { DEFAULT_CURRENCY } from '../domain/types';
import type { Card, Transaction } from '../domain/types';
import { httpCardTransactionsApi } from '../services/cardTransactionsApi';
import type { CardTransactionsApi } from '../services/cardTransactionsApi';

interface PageProps {
  api?: CardTransactionsApi;
  newKey?: () => string;
}

type Feedback = { kind: 'success' | 'error'; text: string } | null;

const defaultKey = (): string => crypto.randomUUID();
const messageOf = (error: unknown): string =>
  error instanceof Error ? error.message : 'Ocurrió un error inesperado.';

export function CardTransactionPage({ api = httpCardTransactionsApi, newKey = defaultKey }: PageProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  // La clave se conserva ante errores de red (reintento seguro) y se renueva tras una respuesta.
  const keyRef = useRef<string | null>(null);

  const loadTransactions = useCallback(
    async (cardId: string) => {
      setLoading(true);
      try {
        setTransactions(await api.listTransactions(cardId));
      } catch (error) {
        setFeedback({ kind: 'error', text: messageOf(error) });
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  useEffect(() => {
    api
      .listCards()
      .then((loaded) => {
        setCards(loaded);
        if (loaded.length > 0) {
          setSelectedCardId(loaded[0].id);
        }
      })
      .catch((error: unknown) => setFeedback({ kind: 'error', text: messageOf(error) }));
  }, [api]);

  useEffect(() => {
    if (selectedCardId) {
      void loadTransactions(selectedCardId);
    }
  }, [selectedCardId, loadTransactions]);

  const handleSubmit = async (amount: number) => {
    keyRef.current ??= newKey();
    setBusy(true);
    setFeedback(null);
    try {
      const result = await api.createPayment(
        { cardId: selectedCardId, amount, currency: DEFAULT_CURRENCY },
        keyRef.current,
      );
      keyRef.current = null;
      setFeedback(
        result.status === 'APPROVED'
          ? { kind: 'success', text: 'Pago aprobado.' }
          : { kind: 'error', text: `Pago rechazado: ${result.rejectionReason ?? 'sin detalle'}` },
      );
      await loadTransactions(selectedCardId);
    } catch (error) {
      setFeedback({ kind: 'error', text: messageOf(error) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageTemplate title="Pago de tarjeta">
      <PaymentForm
        cards={cards}
        selectedCardId={selectedCardId}
        busy={busy}
        onCardChange={setSelectedCardId}
        onSubmit={(amount) => void handleSubmit(amount)}
      />
      {feedback?.kind === 'success' ? <p role="status" className="feedback success">{feedback.text}</p> : null}
      {feedback?.kind === 'error' ? <p role="alert" className="feedback error">{feedback.text}</p> : null}
      <TransactionList transactions={transactions} loading={loading} />
    </PageTemplate>
  );
}
