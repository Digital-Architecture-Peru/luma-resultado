import type { ReactNode } from 'react';

export function CardLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="layout">
      <h1>{title}</h1>
      {children}
    </main>
  );
}
