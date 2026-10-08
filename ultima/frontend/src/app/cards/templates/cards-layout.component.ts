import { Component } from '@angular/core';

@Component({
  selector: 'app-cards-layout',
  standalone: true,
  template: `
    <main class="layout">
      <h1>Mis tarjetas</h1>
      <div class="status"><ng-content select="[status]" /></div>
      <div class="grid">
        <div><ng-content select="[list]" /></div>
        <div><ng-content select="[detail]" /></div>
      </div>
    </main>
  `,
  styles: [`
    .layout { max-width: 72rem; margin-inline: auto; padding: 24px clamp(1rem, 4vw, 2rem); }
    h1 { margin-block: 0 16px; font-size: 1.6rem; }
    .grid { display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); }
    .status:empty { display: none; }
  `],
})
export class CardsLayoutComponent {}
