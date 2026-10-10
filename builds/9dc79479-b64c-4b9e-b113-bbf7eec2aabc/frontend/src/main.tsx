import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NotificationsPage } from './pages/NotificationsPage';
import './styles.css';

const accountId = import.meta.env.VITE_ACCOUNT_ID ?? '10020030041234';

const container = document.getElementById('root');
if (!container) {
  throw new Error('No se encontró el elemento #root');
}

createRoot(container).render(
  <StrictMode>
    <NotificationsPage accountId={accountId} />
  </StrictMode>,
);
