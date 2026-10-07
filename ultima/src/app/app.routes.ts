import { Routes } from '@angular/router';
import { CARDS_ROUTES } from './cards/cards.routes';

// En modo standalone el remote se monta en /tarjetas, igual que en el shell (H3).
export const routes: Routes = [
  { path: 'tarjetas', children: CARDS_ROUTES },
  { path: '', pathMatch: 'full', redirectTo: 'tarjetas' },
  { path: '**', redirectTo: 'tarjetas' },
];
