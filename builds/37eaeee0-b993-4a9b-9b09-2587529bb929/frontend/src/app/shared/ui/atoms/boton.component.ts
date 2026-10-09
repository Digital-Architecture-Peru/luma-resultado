import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Átomo: botón con tipo y estado deshabilitado. */
@Component({
  selector: 'app-boton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button class="btn" [type]="tipo()" [disabled]="deshabilitado()"><ng-content /></button>`,
})
export class BotonComponent {
  readonly tipo = input<'button' | 'submit'>('button');
  readonly deshabilitado = input(false);
}
