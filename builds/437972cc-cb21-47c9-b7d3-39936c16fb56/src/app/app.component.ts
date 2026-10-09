import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationsPageComponent } from './ui/pages/notifications-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificationsPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="app-header"><h1>Banca por Internet</h1></header>
    <main class="app-main"><app-notifications-page /></main>
  `,
})
export class AppComponent {}
