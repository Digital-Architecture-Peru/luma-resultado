import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards-layout',
  standalone: true,
  template: `
    <main class="container">
      <header><h1>{{ title }}</h1></header>
      <ng-content />
    </main>
  `,
})
export class CardsLayoutComponent {
  @Input() title = '';
}
