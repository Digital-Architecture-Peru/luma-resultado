import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeTone = 'info' | 'success' | 'warn' | 'danger';

@Component({
  selector: 'app-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="'badge ' + tone()"><ng-content /></span>`,
  styles: `
    .badge { display: inline-block; padding: 0 var(--space-2); border: 1px solid currentColor;
      border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    .info { color: var(--primary); }
    .success { color: var(--success); }
    .warn { color: var(--warn); }
    .danger { color: var(--danger); }
  `,
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>('info');
}
