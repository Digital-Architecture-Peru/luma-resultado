export interface CardOption {
  id: string;
  last4: string;
  label: string;
}

/**
 * Tarjetas ficticias de demostración (coinciden con el seed del backend).
 * En producción el listado lo entrega Banca por Internet.
 */
export const DEMO_CARDS: readonly CardOption[] = [
  { id: "11111111-1111-4111-8111-111111111111", last4: "4242", label: "Tarjeta de crédito" },
  { id: "22222222-2222-4222-8222-222222222222", last4: "1881", label: "Tarjeta de débito" },
];

export const DEFAULT_API_BASE_URL = "http://localhost:8080/api/v1";
export const DEFAULT_CUSTOMER_ID = "cust-demo-001";
