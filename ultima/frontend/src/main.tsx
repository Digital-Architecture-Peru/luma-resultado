import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NotificacionesPage } from './pages/NotificacionesPage';
import { crearNotificacionesApi } from './services/notificacionesApi';
import './styles.css';

// Punto de composición: la API se construye una sola vez.
const api = crearNotificacionesApi(import.meta.env.VITE_API_BASE_URL ?? '');
const cuentaId = import.meta.env.VITE_CUENTA_ID ?? '0011223344';

const raiz = document.getElementById('root');
if (!raiz) {
  throw new Error('No se encontró el elemento #root');
}

createRoot(raiz).render(
  <StrictMode>
    <NotificacionesPage api={api} cuentaId={cuentaId} />
  </StrictMode>,
);
