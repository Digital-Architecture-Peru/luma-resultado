import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cuentas' },
  {
    path: 'cuentas',
    loadChildren: () =>
      import('./features/accounts/accounts.routes').then((m) => m.ACCOUNTS_ROUTES),
  },
  { path: '**', redirectTo: 'cuentas' },
];
