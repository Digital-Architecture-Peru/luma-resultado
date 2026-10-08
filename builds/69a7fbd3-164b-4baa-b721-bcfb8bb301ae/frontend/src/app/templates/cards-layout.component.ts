import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards-layout',
  standalone: true,
  template: `
    <header class="layout__header"><h1>{{ title }}</h1></header>
    <main class="layout__main"><ng-content /></main>
  `,
})
export class CardsLayoutComponent {
  @Input() title = '';
}
