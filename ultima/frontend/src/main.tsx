import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createCardsApi } from './services/cardsApi';
import { CardPaymentPage } from './pages/CardPaymentPage';
import './styles.css';

// Composición: único punto donde se elige el adaptador HTTP.
const api = createCardsApi({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  customerId: import.meta.env.VITE_CUSTOMER_ID ?? 'cust-001',
});

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró el elemento #root');

createRoot(root).render(
  <StrictMode>
    <CardPaymentPage api={api} />
  </StrictMode>,
);
