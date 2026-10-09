/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base de la API, p. ej. http://localhost:8080/api/v1 */
  readonly VITE_API_BASE_URL?: string;
  /** Identidad ficticia del cliente (en producción la provee Banca por Internet). */
  readonly VITE_CUSTOMER_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
