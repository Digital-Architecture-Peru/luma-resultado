import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PaymentPage } from './pages/PaymentPage';
import './styles.css';

const container = document.getElementById('root');
if (!container) throw new Error('No se encontró el elemento #root');

createRoot(container).render(
  <StrictMode>
    <PaymentPage />
  </StrictMode>,
);
