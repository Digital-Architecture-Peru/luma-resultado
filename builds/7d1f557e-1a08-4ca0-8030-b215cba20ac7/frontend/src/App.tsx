import { crearPagosClient } from './api/pagosClient';
import { PagosPage } from './features/pagos/PagosPage';

const api = crearPagosClient(import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5080');

export function App() {
  return (
    <main className="contenedor">
      <h1>Consulta de pagos</h1>
      <PagosPage api={api} />
    </main>
  );
}
