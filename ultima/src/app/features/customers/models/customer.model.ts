export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string; // ISO 8601
}

/** Datos editables de un cliente (sin id ni fecha de alta). */
export type CustomerDraft = Omit<Customer, 'id' | 'createdAt'>;
