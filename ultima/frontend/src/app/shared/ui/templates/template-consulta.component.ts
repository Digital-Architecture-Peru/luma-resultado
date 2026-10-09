import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Template: estructura de la página de consulta (proyección de contenido). */
@Component({
  selector: 'app-template-consulta',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="contenedor">
      <h1>Consulta de pagos</h1>
      <section class="panel" aria-label="Filtros"><ng-content select="[filtros]" /></section>
      <section class="panel" aria-label="Resultados"><ng-content select="[resultados]" /></section>
      <footer class="pie"><ng-content select="[paginacion]" /></footer>
    </main>
  `,
  styles: [`
    .contenedor { max-inline-size: 72rem; margin-inline: auto; padding: var(--space-6) clamp(1rem, 4vw, 2rem); }
    .panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm); padding: var(--space-4); margin-block-end: var(--space-4); overflow-x: auto; }
    .pie { display: flex; justify-content: center; }
  `],
})
export class TemplateConsultaComponent {}
