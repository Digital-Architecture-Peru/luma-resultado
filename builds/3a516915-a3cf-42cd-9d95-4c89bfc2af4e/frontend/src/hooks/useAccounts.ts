import { useEffect, useState } from 'react';
import type { PaymentsApi } from '../services/paymentsApi';
import type { Account } from '../types';

export interface AccountsState {
  accounts: Account[];
  loading: boolean;
  error?: string;
}

export function useAccounts(api: PaymentsApi): AccountsState {
  const [state, setState] = useState<AccountsState>({ accounts: [], loading: true });

  useEffect(() => {
    let cancelled = false;
    api
      .listAccounts()
      .then((accounts) => {
        if (!cancelled) setState({ accounts, loading: false });
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setState({ accounts: [], loading: false, error: e instanceof Error ? e.message : 'Error inesperado' });
      });
    return () => {
      cancelled = true;
    };
  }, [api]);

  return state;
}
