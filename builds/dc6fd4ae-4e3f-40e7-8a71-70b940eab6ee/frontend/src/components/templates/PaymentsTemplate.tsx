import type { ReactNode } from 'react';

interface PaymentsTemplateProps {
  filters: ReactNode;
  status: ReactNode;
  list: ReactNode;
  detail?: ReactNode;
}

export function PaymentsTemplate({ filters, status, list, detail }: PaymentsTemplateProps) {
  return (
    <main className="layout">
      <h1>Consulta de pagos</h1>
      {filters}
      <div role="status" aria-live="polite">
        {status}
      </div>
      {list}
      {detail}
    </main>
  );
}
