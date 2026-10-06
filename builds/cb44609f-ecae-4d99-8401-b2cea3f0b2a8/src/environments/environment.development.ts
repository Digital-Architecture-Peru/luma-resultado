// Configuración de desarrollo. Sin secretos.
export const environment = {
  production: false,
  useMockGateway: true,
  simulatedLatencyMs: 600,
  locale: 'es-PE',
  currency: 'PEN',
} as const;
