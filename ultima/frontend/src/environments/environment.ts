// Configuración de desarrollo. En producción, reemplazar por la URL del gateway y un token OIDC (H2).
export const environment = {
  apiBaseUrl: 'http://localhost:8080/api/v1',
  // Solo dev: identifica al cliente simulado (cabecera X-Customer-Id).
  devCustomerId: 'cust-001',
};
