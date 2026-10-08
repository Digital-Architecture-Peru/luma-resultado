import { Routes } from '@angular/router';
import { CardsPageComponent } from './pages/cards-page.component';
import { CardDetailPageComponent } from './pages/card-detail-page.component';

export const routes: Routes = [
  { path: '', component: CardsPageComponent, title: 'Mis tarjetas' },
  { path: 'cards/:id', component: CardDetailPageComponent, title: 'Detalle de tarjeta' },
  { path: '**', redirectTo: '' },
];
