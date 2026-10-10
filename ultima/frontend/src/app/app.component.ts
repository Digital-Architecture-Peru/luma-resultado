import { Component } from '@angular/core';
import { NotificationsPageComponent } from './ui/pages/notifications-page/notifications-page.component';

@Component({
  selector: 'app-root',
  imports: [NotificationsPageComponent],
  template: `<app-notifications-page />`,
})
export class AppComponent {}
