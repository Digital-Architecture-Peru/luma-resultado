import { InjectionToken } from '@angular/core';

/** Base de la API; en desarrollo el proxy de Angular la redirige al backend (ver README). */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api/v1',
});

/** Cliente ficticio: sustituye al token real (autenticación fuera de alcance). */
export const CUSTOMER_ID = new InjectionToken<string>('CUSTOMER_ID', {
  providedIn: 'root',
  factory: () => 'CUST-0001',
});
