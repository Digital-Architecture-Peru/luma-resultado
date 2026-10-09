import React from 'react';
import ReactDOM from 'react-dom/client';
import { PaymentPage } from './pages/PaymentPage';
import './styles.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('No se encontro el elemento #root');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <PaymentPage />
  </React.StrictMode>,
);
