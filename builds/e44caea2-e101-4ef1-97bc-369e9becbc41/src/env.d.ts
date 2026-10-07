/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Locale BCP 47 para formatear montos y fechas. Valor publico (no secreto). */
  readonly VITE_APP_LOCALE?: string;
}
