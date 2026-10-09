import { Routes } from '@angular/router';
import { CardsPageComponent } from './cards/pages/cards-page.component';
import { CardDetailPageComponent } from './cards/pages/card-detail-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tarjetas' },
  { path: 'tarjetas', component: CardsPageComponent },
  { path: 'tarjetas/:cardId', component: CardDetailPageComponent },
  { path: '**', redirectTo: 'tarjetas' },
];
