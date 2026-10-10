import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NotificationsPage } from "./pages/NotificationsPage";
import "./styles.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("No se encontró el elemento #root");
}

createRoot(root).render(
  <StrictMode>
    <NotificationsPage accountId={import.meta.env.VITE_ACCOUNT_ID ?? "acc-001"} />
  </StrictMode>,
);
