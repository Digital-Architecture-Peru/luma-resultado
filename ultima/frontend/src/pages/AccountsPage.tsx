import { useEffect, useMemo, useState } from "react";
import { createAccountsClient, type AccountsApi } from "../api/accountsClient";
import { AccountFilter, type TypeFilter } from "../components/molecules/AccountFilter";
import { AccountDetail } from "../components/organisms/AccountDetail";
import { AccountList } from "../components/organisms/AccountList";
import { AccountsLayout } from "../components/templates/AccountsLayout";
import type { Account } from "../domain/account";

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; accounts: Account[] };

function defaultClient(): AccountsApi {
  return createAccountsClient({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
    customerId: import.meta.env.VITE_CUSTOMER_ID ?? "CUST-0001",
  });
}

export function AccountsPage({ api }: { api?: AccountsApi }) {
  const client = useMemo(() => api ?? defaultClient(), [api]);
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [filter, setFilter] = useState<TypeFilter>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    client
      .list()
      .then((page) => active && setState({ kind: "ready", accounts: page.items }))
      .catch((e: unknown) =>
        active &&
        setState({ kind: "error", message: e instanceof Error ? e.message : "Error desconocido" }),
      );
    return () => {
      active = false;
    };
  }, [client]);

  const accounts = state.kind === "ready" ? state.accounts : [];
  const visible = accounts.filter((a) => filter === "ALL" || a.type === filter);
  const selected = accounts.find((a) => a.id === selectedId) ?? null;

  return (
    <AccountsLayout
      title="Mis cuentas"
      filter={<AccountFilter value={filter} onChange={setFilter} />}
      list={
        state.kind === "loading" ? (
          <p role="status">Cargando cuentas…</p>
        ) : state.kind === "error" ? (
          <p role="alert">No se pudo cargar las cuentas: {state.message}</p>
        ) : (
          <AccountList accounts={visible} selectedId={selectedId} onSelect={setSelectedId} />
        )
      }
      detail={<AccountDetail account={selected} />}
    />
  );
}
