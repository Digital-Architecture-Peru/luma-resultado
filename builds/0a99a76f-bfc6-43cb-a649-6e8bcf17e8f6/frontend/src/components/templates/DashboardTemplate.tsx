import type { ReactNode } from "react";

interface DashboardTemplateProps {
  status: ReactNode;
  accounts: ReactNode;
  form: ReactNode;
  movements: ReactNode;
}

export function DashboardTemplate({ status, accounts, form, movements }: DashboardTemplateProps) {
  return (
    <div className="page">
      <header className="page__header">
        <h1>Transferencias entre mis cuentas</h1>
      </header>
      {status}
      <main className="grid">
        <section aria-labelledby="h-accounts">
          <h2 id="h-accounts">Mis cuentas</h2>
          {accounts}
        </section>
        <section aria-labelledby="h-transfer">
          <h2 id="h-transfer">Nueva transferencia</h2>
          {form}
        </section>
        <section aria-labelledby="h-moves" className="grid__wide">
          <h2 id="h-moves">Movimientos</h2>
          {movements}
        </section>
      </main>
    </div>
  );
}
