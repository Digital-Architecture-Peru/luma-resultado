import { Customer } from '../../app/features/customers/models/customer.model';

/** Datos FICTICIOS para desarrollo y pruebas. No corresponden a personas reales. */
export const FAKE_CUSTOMERS: readonly Customer[] = [
  { id: 'c-1', name: 'Ana Ejemplo', email: 'ana@example.com', phone: '+00 111 000 001', city: 'Ciudad Uno', createdAt: '2026-01-10T10:00:00.000Z' },
  { id: 'c-2', name: 'Beto Muestra', email: 'beto@example.com', phone: '+00 111 000 002', city: 'Ciudad Dos', createdAt: '2026-02-15T10:00:00.000Z' },
  { id: 'c-3', name: 'Carla Prueba', email: 'carla@example.com', phone: '+00 111 000 003', city: 'Ciudad Uno', createdAt: '2026-03-20T10:00:00.000Z' },
];
