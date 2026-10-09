const AMOUNT_PATTERN = /^\d{1,17}(\.\d{1,2})?$/;

/** Monto positivo con hasta 2 decimales, como texto (evita coma flotante). */
export function isValidAmount(value: string): boolean {
  return AMOUNT_PATTERN.test(value) && Number(value) > 0;
}
