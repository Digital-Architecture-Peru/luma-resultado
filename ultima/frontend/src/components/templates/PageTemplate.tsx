import type { ReactNode } from 'react';

interface PageTemplateProps {
  title: string;
  children: ReactNode;
}

export function PageTemplate({ title, children }: PageTemplateProps) {
  return (
    <main className="page">
      <h1>{title}</h1>
      <section className="card">{children}</section>
    </main>
  );
}
