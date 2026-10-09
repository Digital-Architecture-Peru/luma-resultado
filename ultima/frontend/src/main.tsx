import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CardTransactionsPage } from './pages/CardTransactionsPage';
import { createTransactionApi } from './services/api';
import './styles.css';

// Tarjeta ficticia del seed (V2__seed.sql).
const DEMO_CARD_ID = '11111111-1111-1111-1111-111111111111';
const api = createTransactionApi();

const container = document.getElementById('root');
if (!container) {
  throw new Error('No se encontró el contenedor #root');
}
createRoot(container).render(
  <StrictMode>
    <CardTransactionsPage api={api} cardId={DEMO_CARD_ID} />
  </StrictMode>,
);
