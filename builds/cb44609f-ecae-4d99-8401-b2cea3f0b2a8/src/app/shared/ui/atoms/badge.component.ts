import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="'badge badge--' + tone()"><ng-content /></span>`,
})
export class UiBadgeComponent {
  readonly tone = input<'success' | 'neutral' | 'error'>('neutral');
}
