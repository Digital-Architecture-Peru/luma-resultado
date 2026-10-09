import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PaymentPage } from './pages/PaymentPage';
import './styles.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('No se encontro el elemento #root');
}

createRoot(root).render(
  <StrictMode>
    <PaymentPage />
  </StrictMode>,
);
