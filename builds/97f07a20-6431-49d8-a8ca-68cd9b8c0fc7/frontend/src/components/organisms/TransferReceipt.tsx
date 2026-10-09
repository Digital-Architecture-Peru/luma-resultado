import type { Account, TransferReceipt as Receipt } from '../../domain/types';
import { Button } from '../atoms/Button';

interface TransferReceiptProps {
  receipt: Receipt;
  accounts: Account[];
  onNewTransfer: () => void;
}

function accountName(accounts: Account[], id: number): string {
  const account = accounts.find((a) => a.id === id);
  return account ? `${account.holderAlias} · ${account.number}` : `Cuenta ${id}`;
}

export function TransferReceipt({ receipt, accounts, onNewTransfer }: TransferReceiptProps) {
  return (
    <section className="card" role="status" aria-label="Comprobante de transferencia">
      <h2>Transferencia realizada</h2>
      <dl className="receipt">
        <dt>Comprobante</dt>
        <dd>{receipt.id}</dd>
        <dt>Origen</dt>
        <dd>{accountName(accounts, receipt.sourceAccountId)}</dd>
        <dt>Destino</dt>
        <dd>{accountName(accounts, receipt.targetAccountId)}</dd>
        <dt>Monto</dt>
        <dd className="num">
          {receipt.amount} {receipt.currency}
        </dd>
        {receipt.description ? (
          <>
            <dt>Descripción</dt>
            <dd>{receipt.description}</dd>
          </>
        ) : null}
        <dt>Fecha</dt>
        <dd>{new Date(receipt.createdAt).toLocaleString('es')}</dd>
      </dl>
      <Button variant="secondary" onClick={onNewTransfer}>
        Nueva transferencia
      </Button>
    </section>
  );
}
