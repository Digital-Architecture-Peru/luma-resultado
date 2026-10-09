import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-resumen-importe',
  styles: `.importe { font-size: 1.75rem; font-weight: 700; font-variant-numeric: tabular-nums; margin: 0; }`,
  template: `<p class="importe">{{ texto() }}</p>`,
})
export class ResumenImporteComponent {
  readonly monto = input.required<number>();
  readonly moneda = input.required<string>();
  readonly texto = computed(() => `${this.monto().toFixed(2)} ${this.moneda()}`);
}
