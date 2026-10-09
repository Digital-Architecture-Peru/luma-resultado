import { Routes } from '@angular/router';
import { NuevoPagoPage } from './pagos/pages/nuevo-pago.page';
import { ConfirmacionPage } from './pagos/pages/confirmacion.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pagos/nuevo' },
  { path: 'pagos/nuevo', component: NuevoPagoPage },
  { path: 'pagos/:id', component: ConfirmacionPage },
  { path: '**', redirectTo: 'pagos/nuevo' },
];
