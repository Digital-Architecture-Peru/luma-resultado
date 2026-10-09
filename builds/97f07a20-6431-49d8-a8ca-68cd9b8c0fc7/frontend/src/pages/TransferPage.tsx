import { useCallback, useEffect, useRef, useState } from 'react';
import { MovementList } from '../components/organisms/MovementList';
import { TransferForm } from '../components/organisms/TransferForm';
import { TransferReceipt } from '../components/organisms/TransferReceipt';
import { TransactionLayout } from '../components/templates/TransactionLayout';
import type { Account, Movement, TransferReceipt as Receipt, TransferRequest } from '../domain/types';
import { createTransfer, listAccounts, listMovements } from '../services/accountsApi';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}

export function TransferPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string>();
  const [receipt, setReceipt] = useState<Receipt>();
  const [movements, setMovements] = useState<Movement[]>([]);
  // Una clave por intento; se renueva solo tras una transferencia exitosa.
  const idempotencyKey = useRef(crypto.randomUUID());

  const refreshAccounts = useCallback(async () => {
    try {
      setAccounts(await listAccounts());
      setLoadError(undefined);
    } catch (error) {
      setLoadError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAccounts();
  }, [refreshAccounts]);

  const handleSubmit = async (request: TransferRequest) => {
    setSubmitting(true);
    setServerError(undefined);
    try {
      const created = await createTransfer(request, idempotencyKey.current);
      idempotencyKey.current = crypto.randomUUID();
      setReceipt(created);
      setMovements(await listMovements(request.sourceAccountId));
      await refreshAccounts();
    } catch (error) {
      setServerError(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const sourceCurrency = accounts.find((a) => a.id === receipt?.sourceAccountId)?.currency;

  return (
    <TransactionLayout
      title="Transferir entre mis cuentas"
      aside={receipt ? <MovementList movements={movements} currency={sourceCurrency} /> : undefined}
    >
      {loading ? <p className="muted">Cargando cuentas…</p> : null}
      {loadError ? (
        <p className="banner banner--error" role="alert">
          {loadError}
        </p>
      ) : null}
      {!loading && !receipt ? (
        <TransferForm accounts={accounts} submitting={submitting} serverError={serverError} onSubmit={handleSubmit} />
      ) : null}
      {receipt ? (
        <TransferReceipt receipt={receipt} accounts={accounts} onNewTransfer={() => setReceipt(undefined)} />
      ) : null}
    </TransactionLayout>
  );
}
