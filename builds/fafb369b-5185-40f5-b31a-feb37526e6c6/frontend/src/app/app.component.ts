import { Component } from '@angular/core';
import { ConsultaPagosPageComponent } from './pages/consulta-pagos/consulta-pagos.page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConsultaPagosPageComponent],
  template: `<app-consulta-pagos />`,
})
export class AppComponent {}
