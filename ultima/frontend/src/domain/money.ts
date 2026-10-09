const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;

export function isValidAmountText(text: string): boolean {
  return AMOUNT_PATTERN.test(text.trim());
}

/** Convierte "12.5" en 1250 centavos sin usar aritmética de punto flotante. */
export function toCents(text: string): number {
  const [whole, fraction = ""] = text.trim().split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

export function formatMoney(amount: string, currency: string): string {
  return new Intl.NumberFormat("es-EC", { style: "currency", currency }).format(Number(amount));
}
