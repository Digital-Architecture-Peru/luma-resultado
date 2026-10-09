import { Component } from '@angular/core';
import { ConsultaPagosPageComponent } from './features/pagos/pages/consulta-pagos.page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConsultaPagosPageComponent],
  template: `<app-consulta-pagos-page />`,
})
export class AppComponent {}
