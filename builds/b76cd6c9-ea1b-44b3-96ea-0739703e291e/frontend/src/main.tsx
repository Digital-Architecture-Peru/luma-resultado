import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NotificationsPage } from './pages/NotificationsPage';
import { createApiFromEnv } from './services/apiFactory';
import './styles.css';

const api = createApiFromEnv();
const container = document.getElementById('root');
if (!container) throw new Error('No se encontró el elemento #root');

createRoot(container).render(
  <StrictMode>
    <NotificationsPage api={api} />
  </StrictMode>,
);
