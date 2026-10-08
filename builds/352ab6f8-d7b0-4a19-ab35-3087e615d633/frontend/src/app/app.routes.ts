import { Routes } from '@angular/router';
import { CardsPageComponent } from './cards/pages/cards-page.component';
import { CardDetailPageComponent } from './cards/pages/card-detail-page.component';

export const routes: Routes = [
  { path: 'cards', component: CardsPageComponent },
  { path: 'cards/:id', component: CardDetailPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'cards' },
  { path: '**', redirectTo: 'cards' },
];
