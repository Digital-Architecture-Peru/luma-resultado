import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'transferencias' },
  {
    path: 'transferencias',
    loadChildren: () => import('./features/transfer/transfer.routes').then((m) => m.TRANSFER_ROUTES),
  },
  { path: '**', redirectTo: 'transferencias' },
];
