import { createHttpApi } from './httpNotificationsApi';
import { createMockApi } from './mockNotificationsApi';
import type { NotificationsApi } from './notificationsApi';

/** Único punto de composición: elige mock o HTTP según variables de entorno de Vite. */
export function createApiFromEnv(): NotificationsApi {
  const env = import.meta.env;
  if (env.VITE_USE_MOCK === 'true') {
    return createMockApi();
  }
  return createHttpApi(env.VITE_API_URL ?? 'http://localhost:5080', env.VITE_CUSTOMER_ID ?? 'CUST-001');
}
