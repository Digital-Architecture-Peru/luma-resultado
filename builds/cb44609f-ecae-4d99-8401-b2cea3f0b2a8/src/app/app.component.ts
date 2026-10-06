import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <a class="skip-link" href="#main">Saltar al contenido</a>
    <header class="app-header"><h1>Banca por Internet</h1></header>
    <main id="main" class="app-main"><router-outlet /></main>
  `,
})
export class AppComponent {}
