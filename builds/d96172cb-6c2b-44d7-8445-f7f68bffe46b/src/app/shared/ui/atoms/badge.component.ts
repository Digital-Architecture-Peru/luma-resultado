import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeTone = 'ok' | 'warn' | 'neutral';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // El texto transmite el estado; el color es solo refuerzo.
  template: `<span class="badge" [class]="'badge ' + tone()">{{ label() }}</span>`,
  styles: `
    .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 600; }
    .ok { color: var(--color-ok); background: var(--color-ok-bg); }
    .warn { color: var(--color-warn); background: var(--color-warn-bg); }
    .neutral { color: var(--color-neutral); background: var(--color-neutral-bg); }
  `,
})
export class BadgeComponent {
  readonly label = input.required<string>();
  readonly tone = input<BadgeTone>('neutral');
}
