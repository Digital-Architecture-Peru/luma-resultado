import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-consultation-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="page">
      <h1>{{ heading() }}</h1>
      <ng-content />
    </main>
  `,
  styles: `
    .page { max-inline-size: 72rem; margin-inline: auto; padding: 1.5rem clamp(1rem, 4vw, 2rem); }
    h1 { margin-block: 0 1rem; font-size: clamp(1.4rem, 3vw, 2rem); text-wrap: balance; }
  `,
})
export class ConsultationLayout {
  readonly heading = input.required<string>();
}
