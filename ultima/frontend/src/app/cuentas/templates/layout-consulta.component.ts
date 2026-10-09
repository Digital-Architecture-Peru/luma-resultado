import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Template: estructura de la pantalla de consulta (listado + detalle). */
@Component({
  selector: 'app-layout-consulta',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="contenedor">
      <h1>Mis cuentas</h1>
      <ng-content select="[estado]" />
      <ng-content select="[listado]" />
      <ng-content select="[detalle]" />
    </main>
  `,
  styles: [`
    .contenedor { max-inline-size: 72rem; margin-inline: auto; display: grid; gap: var(--space-6);
      padding: var(--space-6) clamp(1rem, 4vw, 2rem); }
    h1 { margin: 0; font-size: clamp(1.4rem, 3vw, 2rem); text-wrap: balance; }
  `]
})
export class LayoutConsultaComponent {}
