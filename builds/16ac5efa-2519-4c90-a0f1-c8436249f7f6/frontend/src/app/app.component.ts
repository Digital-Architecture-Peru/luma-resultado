import { Component } from '@angular/core';
import { TransferPageComponent } from './pages/transfer-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TransferPageComponent],
  template: `<app-transfer-page />`,
})
export class AppComponent {}
