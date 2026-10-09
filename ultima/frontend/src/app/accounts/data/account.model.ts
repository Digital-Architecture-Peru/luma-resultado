export type EstadoCuenta = 'ACTIVA' | 'BLOQUEADA' | 'CERRADA';

export interface Cuenta {
  id: string;
  maskedNumber: string;
  productType: string;
  currency: string;
  availableBalance: number;
  ledgerBalance: number;
  status: EstadoCuenta;
  openedAt: string;
  updatedAt: string;
}

export interface Pagina<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}
