import { Component, Input } from '@angular/core';

/** Átomo: PAN enmascarado con etiqueta accesible. */
@Component({
  selector: 'app-masked-pan',
  standalone: true,
  template: `<span class="pan" [attr.aria-label]="label">{{ value }}</span>`,
  styles: [`.pan { font-variant-numeric: tabular-nums; letter-spacing: 0.05em; }`],
})
export class MaskedPanComponent {
  @Input({ required: true }) value = '';

  get label(): string {
    return `Tarjeta terminada en ${this.value.slice(-4)}`;
  }
}
