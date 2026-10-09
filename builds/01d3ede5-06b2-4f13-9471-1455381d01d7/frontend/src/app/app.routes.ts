import { Routes } from '@angular/router';
import { CuentasPageComponent } from './accounts/pages/cuentas.page';
import { CuentaDetallePageComponent } from './accounts/pages/cuenta-detalle.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: CuentasPageComponent },
  { path: 'cuentas/:id', component: CuentaDetallePageComponent },
  { path: '**', redirectTo: '' }
];
