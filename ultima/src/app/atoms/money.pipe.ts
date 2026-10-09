import { Pipe, PipeTransform } from '@angular/core';
import { formatMoney } from '../domain/payment-rules';

/** Átomo: formatea importes en USD. */
@Pipe({ name: 'money', standalone: true })
export class MoneyPipe implements PipeTransform {
  transform(value: number): string {
    return formatMoney(value);
  }
}
