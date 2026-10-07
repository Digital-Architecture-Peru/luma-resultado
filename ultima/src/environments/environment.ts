// Configuración por entorno. Sin secretos: la autenticación la gestiona el shell (AD7).
export interface AppEnvironment {
  /** true: usa MockCardsGateway con datos ficticios. */
  useMock: boolean;
  /** URL base de la API (vacía: integración sin definir). */
  apiBaseUrl: string;
  currency: string;
  locale: string;
}

export const environment: AppEnvironment = {
  useMock: true,
  apiBaseUrl: '',
  currency: 'PEN',
  locale: 'es-PE',
};
