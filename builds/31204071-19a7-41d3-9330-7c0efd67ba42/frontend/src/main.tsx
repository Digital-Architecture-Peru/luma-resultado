import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createNotificationsClient } from "./api/notificationsClient";
import { DEFAULT_API_BASE_URL, DEFAULT_CUSTOMER_ID, DEMO_CARDS } from "./config";
import { CardNotificationsPage } from "./pages/CardNotificationsPage";
import "./styles.css";

// Único punto de composición: el cliente HTTP se crea una vez y se inyecta en la página.
const api = createNotificationsClient(
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  import.meta.env.VITE_CUSTOMER_ID ?? DEFAULT_CUSTOMER_ID,
);

const container = document.getElementById("root");
if (container === null) {
  throw new Error("No se encontró el elemento #root");
}

createRoot(container).render(
  <StrictMode>
    <CardNotificationsPage api={api} cards={DEMO_CARDS} />
  </StrictMode>,
);
