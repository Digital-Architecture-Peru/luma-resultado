import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaymentsPageComponent } from './pages/payments-page.component';

@Component({
  selector: 'app-root',
  imports: [PaymentsPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="app-header">
      <span class="brand">Banca por Internet</span>
    </header>
    <main class="container">
      <app-payments-page />
    </main>
  `,
})
export class AppComponent {}
