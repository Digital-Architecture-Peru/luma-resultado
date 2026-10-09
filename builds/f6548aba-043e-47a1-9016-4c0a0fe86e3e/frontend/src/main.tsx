import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createCardNotificationsClient } from './api/cardNotificationsClient';
import { NotificationsPage } from './pages/NotificationsPage';
import './styles.css';

const api = createCardNotificationsClient();
const container = document.getElementById('root');
if (!container) throw new Error('No se encontró el elemento #root');

createRoot(container).render(
  <StrictMode>
    <NotificationsPage api={api} />
  </StrictMode>,
);
