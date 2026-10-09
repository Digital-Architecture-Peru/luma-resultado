import { Component } from '@angular/core';
import { PagosConsultaPageComponent } from './templates/pagos-consulta-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PagosConsultaPageComponent],
  template: `<app-pagos-consulta-page />`,
})
export class AppComponent {}
