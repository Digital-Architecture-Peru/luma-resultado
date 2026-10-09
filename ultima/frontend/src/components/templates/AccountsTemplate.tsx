import type { ReactNode } from "react";

interface AccountsTemplateProps {
  list: ReactNode;
  detail: ReactNode;
}

export function AccountsTemplate({ list, detail }: AccountsTemplateProps) {
  return (
    <main className="layout">
      <h1>Consulta de cuentas</h1>
      <div className="layout__grid">
        <div>{list}</div>
        <div>{detail}</div>
      </div>
    </main>
  );
}
