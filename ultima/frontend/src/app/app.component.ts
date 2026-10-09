import { Component } from '@angular/core';
import { ConsultaPagosPage } from './pagos/pages/consulta-pagos.page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConsultaPagosPage],
  template: '<app-consulta-pagos-page />',
})
export class AppComponent {}
