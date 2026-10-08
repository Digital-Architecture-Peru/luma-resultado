import { Component, Input } from '@angular/core';

/** Muestra el PAN ya enmascarado por el API (nunca se recibe el número completo). */
@Component({
  selector: 'app-masked-pan',
  standalone: true,
  template: `<span class="pan">{{ maskedPan }}</span>`,
})
export class MaskedPanComponent {
  @Input({ required: true }) maskedPan!: string;
}
