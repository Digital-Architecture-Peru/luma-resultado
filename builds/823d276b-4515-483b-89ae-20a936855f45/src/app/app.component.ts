import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardsPageComponent } from './pages/cards-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CardsPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="app-header"><h1>Banca por Internet · Consulta de Tarjetas</h1></header>
    <main class="container"><app-cards-page /></main>
  `,
})
export class AppComponent {}
