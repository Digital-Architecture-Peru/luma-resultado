import { Component } from '@angular/core';

/** Template: distribucion de la pagina con ranuras de contenido proyectado. */
@Component({
  selector: 'app-consulta-layout',
  standalone: true,
  template: `
    <main class="layout">
      <h1>Consulta de pagos</h1>
      <ng-content select="[filtros]" />
      <ng-content select="[contenido]" />
      <ng-content select="[detalle]" />
    </main>
  `,
  styles: ['.layout { max-inline-size: 72rem; margin-inline: auto; padding: var(--space-6) var(--space-4); display: grid; gap: var(--space-4); }'],
})
export class ConsultaLayoutComponent {}
