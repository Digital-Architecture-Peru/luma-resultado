import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-consulta-layout',
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
      .contenedor {
        max-inline-size: 72rem;
        margin-inline: auto;
        padding: var(--space-6) clamp(1rem, 4vw, 2rem);
      }
      h1 { margin-block: 0 var(--space-6); font-size: clamp(1.5rem, 3vw, 2rem); text-wrap: balance; }
    `,
  ],
})
export class ConsultaLayoutComponent {
  @Input() titulo = 'Mis tarjetas';
}
