import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconButtonComponent } from '../../../shared/ui/atoms/icon-button.component';

/** Template (Atomic Design): estructura de pantalla móvil con cabecera y contenido proyectado. */
@Component({
  selector: 'app-mobile-list-detail-template',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButtonComponent],
  template: `
    <header class="bar">
      @if (showBack()) {
        <app-icon-button label="Volver a la lista de cuentas" icon="←" (pressed)="back.emit()" />
      }
      <h1>{{ heading() }}</h1>
    </header>
    <main class="content"><ng-content /></main>
  `,
  styles: `
    :host { display: block; min-height: 100vh; }
    .bar { position: sticky; top: 0; display: flex; align-items: center; gap: var(--space-2);
      min-height: 56px; padding: 0 var(--space-3); background: var(--color-primary); color: var(--color-primary-contrast); }
    h1 { margin: 0; font-size: 1.15rem; }
    .content { max-width: 640px; margin: 0 auto; padding: var(--space-3); display: grid; gap: var(--space-3); }
  `,
})
export class MobileListDetailTemplate {
  readonly heading = input.required<string>();
  readonly showBack = input<boolean>(false);
  readonly back = output<void>();
}
