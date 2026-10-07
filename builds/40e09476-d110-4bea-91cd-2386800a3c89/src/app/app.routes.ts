import { Routes } from '@angular/router';
import { CardsPage } from './features/cards/pages/cards-page';
import { CardDetailPage } from './features/cards/pages/card-detail-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tarjetas' },
  { path: 'tarjetas', component: CardsPage, title: 'Mis tarjetas' },
  { path: 'tarjetas/:id', component: CardDetailPage, title: 'Detalle de tarjeta' },
  { path: '**', redirectTo: 'tarjetas' },
];
