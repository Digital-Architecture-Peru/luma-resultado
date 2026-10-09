import { useCallback, useEffect, useState } from "react";
import { TransferForm } from "../components/organisms/TransferForm";
import { PageTemplate } from "../components/templates/PageTemplate";
import { useTransfer } from "../hooks/useTransfer";
import type { Account, TransfersClient } from "../types";

interface TransferPageProps {
  client: TransfersClient;
}

export function TransferPage({ client }: TransferPageProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { state, submit } = useTransfer(client);

  const loadAccounts = useCallback(() => {
    client
      .listAccounts()
      .then(setAccounts)
      .catch(() => setLoadError("No se pudieron cargar las cuentas"));
  }, [client]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    if (state.status === "success") loadAccounts();
  }, [state.status, loadAccounts]);

  return (
    <PageTemplate title="Transferencia entre cuentas propias">
      {loadError ? <p role="alert">{loadError}</p> : null}
      <TransferForm accounts={accounts} submitting={state.status === "loading"} onSubmit={submit} />
      <div role="status" aria-live="polite" className="status">
        {state.status === "success"
          ? `Transferencia ${state.receipt.id} realizada por ${state.receipt.amount} ${state.receipt.currency}`
          : null}
        {state.status === "error" ? state.message : null}
      </div>
    </PageTemplate>
  );
}
