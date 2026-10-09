const PARTIAL_AMOUNT = /^\d{0,16}(\.\d{0,2})?$/;
const FINAL_AMOUNT = /^\d{1,16}(\.\d{1,2})?$/;

/** Acepta valores intermedios de tipeo ("", "12.", "12.3"). */
export function isPartialAmount(value: string): boolean {
  return PARTIAL_AMOUNT.test(value);
}

/** Monto final: hasta dos decimales y mayor que cero. */
export function isPositiveAmount(value: string): boolean {
  return FINAL_AMOUNT.test(value) && Number(value) > 0;
}
