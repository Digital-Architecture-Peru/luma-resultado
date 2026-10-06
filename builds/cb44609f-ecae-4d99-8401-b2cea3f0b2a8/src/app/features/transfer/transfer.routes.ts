import { Routes } from '@angular/router';

export const TRANSFER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/transfer.page').then((m) => m.TransferPage),
  },
];
