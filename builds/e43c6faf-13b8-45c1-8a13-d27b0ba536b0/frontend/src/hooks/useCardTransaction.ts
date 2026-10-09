import { useCallback, useEffect, useState } from 'react';
import type { CardTransaction, NewTransaction, TransactionApi } from '../services/api';

export type RemoteStatus = 'idle' | 'loading' | 'success' | 'error';

export interface CardTransactionState {
  transactions: CardTransaction[];
  status: RemoteStatus;
  error: string | null;
  submit: (tx: NewTransaction) => Promise<boolean>;
}

function messageOf(e: unknown): string {
  return e instanceof Error ? e.message : 'Error inesperado';
}

export function useCardTransaction(api: TransactionApi, cardId: string): CardTransactionState {
  const [transactions, setTransactions] = useState<CardTransaction[]>([]);
  const [status, setStatus] = useState<RemoteStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setTransactions(await api.list(cardId));
      setError(null);
      setStatus('success');
    } catch (e) {
      setError(messageOf(e));
      setStatus('error');
    }
  }, [api, cardId]);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = useCallback(
    async (tx: NewTransaction): Promise<boolean> => {
      try {
        await api.create(cardId, tx, crypto.randomUUID());
        await load();
        return true;
      } catch (e) {
        setError(messageOf(e));
        setStatus('error');
        return false;
      }
    },
    [api, cardId, load],
  );

  return { transactions, status, error, submit };
}
