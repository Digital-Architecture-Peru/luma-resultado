import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AccountsPage } from "./pages/AccountsPage";
import "./styles.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Elemento #root no encontrado");
}

createRoot(root).render(
  <StrictMode>
    <AccountsPage />
  </StrictMode>,
);
