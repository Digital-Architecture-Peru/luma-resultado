import { Component, Input } from '@angular/core';

/** El estado se comunica con texto, no solo con color. */
@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span class="badge" [class.badge-ok]="tone === 'ok'" [class.badge-warn]="tone === 'warn'"><ng-content /></span>`,
})
export class AppBadgeComponent {
  @Input() tone: 'ok' | 'warn' | 'info' = 'info';
}
