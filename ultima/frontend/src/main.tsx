import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createNotificationsClient } from "./api/notificationsClient";
import { PaymentsPage } from "./pages/PaymentsPage";
import "./styles.css";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
// Cliente ficticio: sustituto temporal de la autenticación real (H2).
const customerId = import.meta.env.VITE_CUSTOMER_ID ?? "cust-demo-001";
const api = createNotificationsClient(apiUrl, customerId);

const container = document.getElementById("root");
if (!container) {
  throw new Error("No se encontró el elemento #root");
}

createRoot(container).render(
  <StrictMode>
    <PaymentsPage api={api} />
  </StrictMode>,
);
