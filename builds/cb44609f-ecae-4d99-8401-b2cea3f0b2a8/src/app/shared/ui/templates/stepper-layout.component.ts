import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  input,
  viewChild,
} from '@angular/core';

const STEPS = ['Datos', 'Confirmación', 'Comprobante'] as const;

/** Template: estructura de página con indicador de pasos y foco gestionado en el título. */
@Component({
  selector: 'ui-stepper-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card" aria-labelledby="stepper-title">
      <h2 id="stepper-title" #heading tabindex="-1">{{ title() }}</h2>
      <ol class="stepper" aria-label="Progreso">
        @for (label of steps; track label; let i = $index) {
          <li [attr.aria-current]="i + 1 === step() ? 'step' : null">{{ i + 1 }}. {{ label }}</li>
        }
      </ol>
      <ng-content />
    </section>
  `,
})
export class StepperLayoutComponent {
  readonly title = input.required<string>();
  /** Paso actual, 1..3. */
  readonly step = input.required<number>();
  readonly steps = STEPS;

  private readonly heading = viewChild<ElementRef<HTMLElement>>('heading');
  private firstRun = true;

  constructor() {
    effect(() => {
      this.step();
      const el = this.heading()?.nativeElement;
      if (this.firstRun) {
        this.firstRun = false;
        return;
      }
      el?.focus();
    });
  }
}
