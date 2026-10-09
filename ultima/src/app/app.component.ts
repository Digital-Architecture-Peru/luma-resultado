import { Component } from '@angular/core';
import { NotificationsPageComponent } from './pages/notifications-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NotificationsPageComponent],
  template: `
    <header class="topbar"><h1>Banca por Internet</h1></header>
    <main class="container"><app-notifications-page /></main>
  `,
})
export class AppComponent {}
