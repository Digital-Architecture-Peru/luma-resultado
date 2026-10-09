import type { ReactNode } from "react";

interface AccountsLayoutProps {
  title: string;
  filter: ReactNode;
  list: ReactNode;
  detail: ReactNode;
}

export function AccountsLayout({ title, filter, list, detail }: AccountsLayoutProps) {
  return (
    <main className="layout">
      <h1>{title}</h1>
      {filter}
      <div className="layout__grid">
        <div>{list}</div>
        <div>{detail}</div>
      </div>
    </main>
  );
}
