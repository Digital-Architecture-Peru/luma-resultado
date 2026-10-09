import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "../api/accountsClient";
import type { AccountsApi } from "../api/accountsClient";
import { Alert } from "../components/atoms/Alert";
import { AccountList } from "../components/organisms/AccountList";
import { TransactionList } from "../components/organisms/TransactionList";
import { TransferForm } from "../components/organisms/TransferForm";
import { DashboardTemplate } from "../components/templates/DashboardTemplate";
import type { Account, Transaction, TransferRequest } from "../domain/types";

interface TransferPageProps {
  api: AccountsApi;
}

interface Feedback {
  kind: "success" | "error";
  text: string;
}

export function TransferPage({ api }: TransferPageProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  // La misma clave se reutiliza ante reintentos hasta que la transferencia se confirme.
  const idempotencyKey = useRef<string>(crypto.randomUUID());

  const loadAccounts = useCallback(async () => {
    const list = await api.listAccounts();
    setAccounts(list);
    setSelectedId((current) => current ?? list[0]?.id ?? null);
  }, [api]);

  useEffect(() => {
    loadAccounts()
      .catch(() => setFeedback({ kind: "error", text: "No se pudieron cargar las cuentas." }))
      .finally(() => setLoading(false));
  }, [loadAccounts]);

  useEffect(() => {
    if (selectedId === null) return;
    let cancelled = false;
    api
      .listTransactions(selectedId)
      .then((list) => {
        if (!cancelled) setTransactions(list);
      })
      .catch(() => {
        if (!cancelled) setFeedback({ kind: "error", text: "No se pudieron cargar los movimientos." });
      });
    return () => {
      cancelled = true;
    };
  }, [api, selectedId, accounts]);

  const handleSubmit = async (request: TransferRequest) => {
    setSubmitting(true);
    setFeedback(null);
    try {
      await api.createTransfer(request, idempotencyKey.current);
      idempotencyKey.current = crypto.randomUUID();
      setFeedback({ kind: "success", text: "Transferencia realizada con éxito." });
      await loadAccounts();
    } catch (error) {
      const text = error instanceof ApiError ? error.message : "No se pudo realizar la transferencia.";
      setFeedback({ kind: "error", text });
    } finally {
      setSubmitting(false);
    }
  };

  const selected = accounts.find((a) => a.id === selectedId);

  return (
    <DashboardTemplate
      status={feedback ? <Alert kind={feedback.kind}>{feedback.text}</Alert> : null}
      accounts={
        loading ? (
          <p className="muted">Cargando cuentas…</p>
        ) : (
          <AccountList accounts={accounts} selectedId={selectedId} onSelect={setSelectedId} />
        )
      }
      form={<TransferForm accounts={accounts} submitting={submitting} onSubmit={handleSubmit} />}
      movements={<TransactionList transactions={transactions} currency={selected?.currency ?? "USD"} />}
    />
  );
}
