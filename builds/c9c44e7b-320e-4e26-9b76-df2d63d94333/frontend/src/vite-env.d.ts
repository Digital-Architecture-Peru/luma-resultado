/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_CUSTOMER_ID?: string;
  readonly VITE_POLL_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
