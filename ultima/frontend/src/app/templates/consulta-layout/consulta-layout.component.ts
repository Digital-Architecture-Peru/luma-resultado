import { Component, Input } from '@angular/core';

/** Plantilla: estructura de página (cabecera + contenido proyectado). */
@Component({
  selector: 'app-consulta-layout',
  standalone: true,
  template: `
    <header>
      <h1>{{ titulo }}</h1>
      <p>Banca por Internet</p>
    </header>
    <main><ng-content /></main>
  `,
  styles: [
    `
      :host { display: block; max-inline-size: 72rem; margin-inline: auto; padding: 1.5rem clamp(1rem, 4vw, 2rem); }
      h1 { margin: 0; font-size: clamp(1.4rem, 3vw, 1.9rem); }
      header p { margin: 0 0 1rem; color: var(--muted); }
      main { display: grid; gap: 1rem; }
    `,
  ],
})
export class ConsultaLayoutComponent {
  @Input() titulo = '';
}
