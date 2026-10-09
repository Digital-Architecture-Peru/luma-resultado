import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TransferenciaPageComponent } from './features/transferencias/pages/transferencia.page';

@Component({
  selector: 'app-root',
  imports: [TransferenciaPageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-transferencia-page />`,
})
export class AppComponent {}
