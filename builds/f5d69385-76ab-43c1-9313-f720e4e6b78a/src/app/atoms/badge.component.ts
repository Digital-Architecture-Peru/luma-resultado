import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Átomo: etiqueta de estado (texto + color, nunca solo color). */
@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class.badge-ok]="tone === 'ok'"><ng-content /></span>`,
})
export class BadgeComponent {
  @Input() tone: 'ok' | 'neutral' = 'neutral';
}
