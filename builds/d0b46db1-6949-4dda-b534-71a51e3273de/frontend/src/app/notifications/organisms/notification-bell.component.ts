import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BadgeComponent } from '../atoms/badge.component';

@Component({
  selector: 'app-notification-bell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent],
  template: `
    <span class="bell" [attr.aria-label]="label()" role="img">
      <span aria-hidden="true">🔔</span>
      @if (count() > 0) {
        <app-badge tone="danger">{{ count() }}</app-badge>
      }
    </span>
  `,
  styles: `
    .bell { display: inline-flex; gap: var(--space-2); align-items: center; }
  `,
})
export class NotificationBellComponent {
  readonly count = input(0);
  protected readonly label = computed(() =>
    this.count() === 0 ? 'Sin notificaciones nuevas' : `${this.count()} notificaciones nuevas`,
  );
}
