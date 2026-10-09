import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-notifications-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="head"><ng-content select="[slot=header]" /></header>
    <main class="main"><ng-content /></main>
  `,
  styles: `
    :host { display: block; max-inline-size: 48rem; margin-inline: auto;
      padding: var(--space-6) clamp(1rem, 4vw, 2rem); }
    .head { display: flex; justify-content: space-between; align-items: center;
      gap: var(--space-4); margin-block-end: var(--space-4); }
  `,
})
export class NotificationsLayoutComponent {}
