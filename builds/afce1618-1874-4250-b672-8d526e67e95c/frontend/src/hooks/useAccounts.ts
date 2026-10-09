import { useEffect, useState } from "react";
import { accountsApi, type AccountsApi } from "../services/accountsApi";
import type { Account, RemoteState } from "../types/account";

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : "Error desconocido";
}

/** Carga una vez por cambio de `id`; `null` deja el estado en reposo. */
function useRemoteById<T>(
  id: string | null,
  load: (id: string, signal: AbortSignal) => Promise<T>,
): RemoteState<T> {
  const [state, setState] = useState<RemoteState<T>>({ status: "idle" });

  useEffect(() => {
    if (id === null) {
      setState({ status: "idle" });
      return;
    }
    const controller = new AbortController();
    setState({ status: "loading" });
    load(id, controller.signal)
      .then((data) => setState({ status: "success", data }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({ status: "error", message: messageOf(error) });
        }
      });
    return () => controller.abort();
  }, [id, load]);

  return state;
}

export function useAccounts(api: AccountsApi = accountsApi): RemoteState<Account[]> {
  const [state, setState] = useState<RemoteState<Account[]>>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    api
      .list(controller.signal)
      .then((data) => setState({ status: "success", data }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({ status: "error", message: messageOf(error) });
        }
      });
    return () => controller.abort();
  }, [api]);

  return state;
}

export function useAccountDetail(
  id: string | null,
  api: AccountsApi = accountsApi,
): RemoteState<Account> {
  const [loader] = useState(() => (accountId: string, signal: AbortSignal) =>
    api.get(accountId, signal),
  );
  return useRemoteById(id, loader);
}
