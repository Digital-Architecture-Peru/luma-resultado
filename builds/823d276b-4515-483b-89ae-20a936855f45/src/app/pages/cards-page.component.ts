import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { filterCards, EMPTY_QUERY } from '../domain/card-query';
import { Card, CardQuery } from '../domain/card.model';
import { CARD_REPOSITORY } from '../domain/card.repository.token';
import { CardFilterComponent } from '../molecules/card-filter.component';
import { CardListComponent } from '../organisms/card-list.component';

type LoadState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-cards-page',
  standalone: true,
  imports: [CardFilterComponent, CardListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="cards-title">
      <h2 id="cards-title">Mis tarjetas</h2>

      @switch (state()) {
        @case ('loading') {
          <p role="status" class="skeleton">Cargando tarjetas…</p>
        }
        @case ('error') {
          <div role="alert" class="error">
            <p>No pudimos obtener tus tarjetas. Inténtalo nuevamente.</p>
            <button type="button" (click)="load()">Reintentar</button>
          </div>
        }
        @default {
          <app-card-filter [query]="query()" (queryChange)="query.set($event)" />
          <p role="status" class="muted">{{ visible().length }} de {{ cards().length }} tarjetas</p>
          <app-card-list [cards]="visible()" />
        }
      }
    </section>
  `,
})
export class CardsPageComponent implements OnInit {
  private readonly repository = inject(CARD_REPOSITORY);

  readonly state = signal<LoadState>('loading');
  readonly cards = signal<Card[]>([]);
  readonly query = signal<CardQuery>(EMPTY_QUERY);
  readonly visible = computed(() => filterCards(this.cards(), this.query()));

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.state.set('loading');
    try {
      this.cards.set(await this.repository.list());
      this.state.set('success');
    } catch {
      this.state.set('error');
    }
  }
}
