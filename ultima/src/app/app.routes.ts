import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tarjetas',
    loadComponent: () =>
      import('./features/tarjetas/ui/pages/consulta-tarjetas.page').then(
        (m) => m.ConsultaTarjetasPage,
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'tarjetas' },
  { path: '**', redirectTo: 'tarjetas' },
];
