import React from 'react';
import { createRoot } from 'react-dom/client';
import { PaymentsPage } from './pages/PaymentsPage';
import { createPaymentsApi } from './services/paymentsApi';
import './styles.css';

const api = createPaymentsApi(
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  import.meta.env.VITE_CUSTOMER_ID ?? 'CUST-0001',
);

const container = document.getElementById('root');
if (!container) {
  throw new Error('No se encontró el elemento #root');
}

createRoot(container).render(
  <React.StrictMode>
    <PaymentsPage api={api} />
  </React.StrictMode>,
);
