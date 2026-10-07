import { Routes } from '@angular/router';

export const ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/accounts-list.page').then((m) => m.AccountsListPage),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/account-detail.page').then((m) => m.AccountDetailPage),
  },
];
