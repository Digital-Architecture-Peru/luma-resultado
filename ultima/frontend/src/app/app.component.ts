import { Component } from '@angular/core';
import { CuentasPageComponent } from './features/cuentas/pages/cuentas-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CuentasPageComponent],
  template: '<app-cuentas-page />',
})
export class AppComponent {}
