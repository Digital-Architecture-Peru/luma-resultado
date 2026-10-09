import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Atom: botón accesible. */
@Component({
  selector: 'app-boton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="boton" [disabled]="deshabilitado()" (click)="pulsado.emit()">
      <ng-content />
    </button>
  `,
  styles: `
    .boton { min-height: 44px; padding: 0 var(--space-6); border: 0; border-radius: var(--radius-md);
      background: var(--primary); color: var(--primary-contrast); font: inherit; font-weight: 600; cursor: pointer; }
    .boton:disabled { opacity: 0.55; cursor: not-allowed; }
  `,
})
export class Boton {
  readonly deshabilitado = input(false);
  readonly pulsado = output<void>();
}
