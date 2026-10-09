import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TransferPage } from "./pages/TransferPage";
import { httpTransfersClient } from "./api/transfersClient";
import "./styles.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("No se encontró el elemento #root");
}

createRoot(root).render(
  <StrictMode>
    <TransferPage client={httpTransfersClient} />
  </StrictMode>,
);
