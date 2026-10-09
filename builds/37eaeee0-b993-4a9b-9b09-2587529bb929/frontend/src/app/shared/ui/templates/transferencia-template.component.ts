import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Plantilla: estructura de página con ranuras para formulario y resultado. */
@Component({
  selector: 'app-transferencia-template',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="layout">
      <header><h1>Transferencia entre mis cuentas</h1></header>
      <ng-content select="[slot=estado]" />
      <ng-content select="[slot=formulario]" />
      <ng-content select="[slot=resultado]" />
    </main>
  `,
})
export class TransferenciaTemplateComponent {}
