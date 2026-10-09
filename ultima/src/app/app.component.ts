import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotificationCenterComponent } from './ui/organisms/notification-center.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificationCenterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="page">
      <h1>Banca por Internet</h1>
      <app-notification-center />
    </main>
  `
})
export class AppComponent {}
