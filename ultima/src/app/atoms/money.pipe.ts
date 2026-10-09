import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyCode } from '../core/account.model';

const NUMBER_LOCALE = 'en-US';
const FRACTION_DIGITS = 2;

/** Símbolos fijos: el resultado no depende de los datos ICU de cada entorno. */
const CURRENCY_SYMBOLS: Readonly<Record<CurrencyCode, string>> = {
  PEN: 'S/',
  USD: 'US$',
};

const AMOUNT_FORMAT = new Intl.NumberFormat(NUMBER_LOCALE, {
  minimumFractionDigits: FRACTION_DIGITS,
  maximumFractionDigits: FRACTION_DIGITS,
});

/** Átomo: formatea importes con su moneda (ej. "S/ 1,234.50", "US$ 10.00"). */
@Pipe({ name: 'money', standalone: true })
export class MoneyPipe implements PipeTransform {
  transform(value: number, currency: CurrencyCode): string {
    return `${CURRENCY_SYMBOLS[currency]} ${AMOUNT_FORMAT.format(value)}`;
  }
}
