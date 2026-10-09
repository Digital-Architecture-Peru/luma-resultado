import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Atom: muestra una tarjeta enmascarada (nunca el PAN completo). */
@Component({
  selector: 'app-etiqueta-tarjeta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="etiqueta">{{ texto() }}</span>`,
  styles: `.etiqueta { font-variant-numeric: tabular-nums; letter-spacing: 0.04em; }`,
})
export class EtiquetaTarjeta {
  readonly ultimos4 = input.required<string>();
  readonly tipo = input('');

  readonly texto = computed(() => {
    const prefijo = this.tipo() ? `${this.tipo()} ` : '';
    return `${prefijo}•••• ${this.ultimos4()}`;
  });
}
