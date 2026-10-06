// Configuración de producción. Sin secretos: solo banderas de comportamiento.
export const environment = {
  production: true,
  useMockGateway: true,
  simulatedLatencyMs: 400,
  locale: 'es-PE',
  currency: 'PEN',
} as const;
