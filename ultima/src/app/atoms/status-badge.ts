import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class.badge-danger]="tone() === 'danger'">{{ text() }}</span>`,
})
export class StatusBadge {
  readonly text = input.required<string>();
  readonly tone = input<'success' | 'danger'>('success');
}
