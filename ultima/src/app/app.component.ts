import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="app-header">
      <div class="container"><a routerLink="/clientes">Gestión de clientes</a></div>
    </header>
    <main class="container">
      <router-outlet />
    </main>
  `,
})
export class AppComponent {}
