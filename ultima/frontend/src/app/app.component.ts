import { Component } from '@angular/core';
import { NotificationsPageComponent } from './pages/notifications-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificationsPageComponent],
  template: '<app-notifications-page />',
})
export class AppComponent {}
