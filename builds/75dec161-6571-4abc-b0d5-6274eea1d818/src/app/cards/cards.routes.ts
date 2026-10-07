import { Routes } from '@angular/router';
import { CardsGateway } from './data/cards.gateway';
import { MockCardsGateway } from './data/mock-cards.gateway';
import { HttpCardsGateway } from './data/http-cards.gateway';
import { environment } from '../../environments/environment';
import { CardListComponent } from './ui/card-list/card-list.component';
import { CardDetailComponent } from './ui/card-detail/card-detail.component';

/** Rutas expuestas por federación como `./routes`. */
export const CARDS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      {
        provide: CardsGateway,
        useClass: environment.useMock ? MockCardsGateway : HttpCardsGateway,
      },
    ],
    children: [
      { path: '', component: CardListComponent },
      { path: ':id', component: CardDetailComponent },
    ],
  },
];

export default CARDS_ROUTES;
