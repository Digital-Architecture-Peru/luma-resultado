import { Component } from '@angular/core';
import { NotificationsPage } from './pages/notifications.page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificationsPage],
  template: `<app-notifications-page />`,
})
export class AppComponent {}
