import { Component } from '@angular/core';
import { CardNotificationsPageComponent } from './notifications/pages/card-notifications-page.component';

@Component({
  selector: 'app-root',
  imports: [CardNotificationsPageComponent],
  template: `<app-card-notifications-page />`,
})
export class AppComponent {}
