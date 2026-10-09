import { useMemo } from 'react';
import { createPaymentsClient } from './api/paymentsClient';
import { PaymentsPage } from './pages/PaymentsPage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5080';
// H1: identidad simulada (cliente ficticio del seed); reemplazar por la sesión de la banca anfitriona.
const CUSTOMER_ID = import.meta.env.VITE_CUSTOMER_ID ?? '11111111-1111-1111-1111-111111111111';

export default function App() {
  const api = useMemo(() => createPaymentsClient(API_BASE_URL, CUSTOMER_ID), []);
  return <PaymentsPage api={api} />;
}
