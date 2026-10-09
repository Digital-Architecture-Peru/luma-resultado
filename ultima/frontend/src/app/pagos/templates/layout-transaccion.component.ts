import { Component, input } from '@angular/core';

@Component({
  selector: 'app-layout-transaccion',
  styles: `
    main { max-inline-size: 36rem; margin-inline: auto; padding: clamp(1rem, 4vw, 2rem); }
    header { margin-block-end: 1rem; }
  `,
  template: `
    <main>
      <header><h1>{{ titulo() }}</h1></header>
      <div class="card"><ng-content /></div>
    </main>
  `,
})
export class LayoutTransaccionComponent {
  readonly titulo = input.required<string>();
}
