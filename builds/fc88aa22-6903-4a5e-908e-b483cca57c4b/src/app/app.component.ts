import { Component } from '@angular/core';
import { AccountsPageComponent } from './pages/accounts-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AccountsPageComponent],
  template: `
    <header class="topbar"><strong>Banca por Internet</strong></header>
    <main class="container"><app-accounts-page /></main>
  `,
})
export class AppComponent {}
