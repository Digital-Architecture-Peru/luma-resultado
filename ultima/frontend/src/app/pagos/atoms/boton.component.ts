import { Component, input } from '@angular/core';

@Component({
  selector: 'app-boton',
  template: `<button class="btn" [type]="tipo()" [disabled]="deshabilitado()">{{ etiqueta() }}</button>`,
})
export class BotonComponent {
  readonly etiqueta = input.required<string>();
  readonly tipo = input<'button' | 'submit'>('button');
  readonly deshabilitado = input(false);
}
