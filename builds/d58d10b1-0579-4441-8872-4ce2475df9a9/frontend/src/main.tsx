import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TarjetasPage } from "./pages/TarjetasPage";
import "./styles.css";

const raiz = document.getElementById("root");
if (!raiz) {
  throw new Error("No se encontró el elemento #root");
}

createRoot(raiz).render(
  <StrictMode>
    <TarjetasPage />
  </StrictMode>,
);
