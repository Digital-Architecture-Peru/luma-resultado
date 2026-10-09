import React from 'react';
import ReactDOM from 'react-dom/client';
import { createNotificationsApi } from './services/notificationsApi';
import NotificationsPage from './pages/NotificationsPage';
import './styles.css';

const api = createNotificationsApi({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  customerId: import.meta.env.VITE_CUSTOMER_ID ?? 'CLI-0001',
});

const container = document.getElementById('root');
if (!container) {
  throw new Error('No se encontró el contenedor #root');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <NotificationsPage api={api} />
  </React.StrictMode>,
);
