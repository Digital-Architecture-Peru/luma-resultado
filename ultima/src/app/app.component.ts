import { Component } from '@angular/core';
import { CardsPageComponent } from './pages/cards-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CardsPageComponent],
  template: `<app-cards-page />`,
})
export class AppComponent {}
