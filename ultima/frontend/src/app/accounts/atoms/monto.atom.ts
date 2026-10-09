import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export function formatMonto(value: number, currency: string, locale = 'es-PE'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

@Component({
  selector: 'app-monto',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="monto">{{ texto }}</span>`,
  styles: [`.monto { font-variant-numeric: tabular-nums; font-weight: 600; }`]
})
export class MontoComponent {
  @Input({ required: true }) value = 0;
  @Input({ required: true }) currency = 'PEN';

  get texto(): string {
    return formatMonto(this.value, this.currency);
  }
}
