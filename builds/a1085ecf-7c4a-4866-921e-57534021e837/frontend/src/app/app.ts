import { Component } from '@angular/core';
import { TransaccionPage } from './features/transaccion-tarjeta/pages/transaccion-page';

@Component({
  selector: 'app-root',
  imports: [TransaccionPage],
  template: '<app-transaccion-page />',
})
export class App {}
