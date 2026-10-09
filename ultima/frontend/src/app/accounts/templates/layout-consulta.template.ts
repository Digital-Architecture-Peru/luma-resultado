import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-layout-consulta',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="contenedor">
      <h1>{{ titulo }}</h1>
      <ng-content />
    </main>
  `,
  styles: [
    `
      .contenedor { max-width: 72rem; margin-inline: auto; padding: var(--space-6) clamp(1rem, 4vw, 2rem); }
    `
  ]
})
export class LayoutConsultaComponent {
  @Input({ required: true }) titulo = '';
}
