import { Component, Input } from '@angular/core';

/** Plantilla: esqueleto de página con título y contenido proyectado. */
@Component({
  selector: 'app-pagina-template',
  standalone: true,
  template: `
    <main class="plantilla">
      <h1>{{ titulo }}</h1>
      <ng-content />
    </main>
  `,
})
export class PaginaTemplateComponent {
  @Input() titulo = '';
}
