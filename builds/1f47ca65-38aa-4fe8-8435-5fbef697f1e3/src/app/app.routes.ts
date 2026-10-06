import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'clientes' },
  {
    path: 'clientes',
    loadComponent: () =>
      import('./features/customers/pages/customers-list.page').then((m) => m.CustomersListPage),
    title: 'Clientes',
  },
  {
    path: 'clientes/nuevo',
    loadComponent: () =>
      import('./features/customers/pages/customer-form.page').then((m) => m.CustomerFormPage),
    title: 'Nuevo cliente',
  },
  {
    path: 'clientes/:id/editar',
    loadComponent: () =>
      import('./features/customers/pages/customer-form.page').then((m) => m.CustomerFormPage),
    title: 'Editar cliente',
  },
  { path: '**', redirectTo: 'clientes' },
];
