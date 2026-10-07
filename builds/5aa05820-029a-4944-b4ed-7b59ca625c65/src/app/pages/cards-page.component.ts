import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { filterCards } from '../domain/card-query';
import { Card, StatusFilter } from '../domain/card.model';
import { CardRepository } from '../domain/card.repository';
import { CardFilterComponent } from '../molecules/card-filter.component';
import { CardListComponent } from '../organisms/card-list.component';

type LoadState = 'loading' | 'success' | 'error';

/** Página (contenedor): orquesta repositorio, filtros y organismos. */
@Component({
  selector: 'app-cards-page',
  standalone: true,
  imports: [CardFilterComponent, CardListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="page">
      <h1>Consulta de tarjetas</h1>
      <app-card-filter (textChange)="text.set($event)" (statusChange)="status.set($event)" />
      <div role="status" aria-live="polite">
        @switch (state()) {
          @case ('loading') { <p>Cargando tarjetas…</p> }
          @case ('error') { <p class="error">No fue posible consultar las tarjetas.</p> }
          @default { <p>{{ visible().length }} de {{ cards().length }} tarjetas</p> }
        }
      </div>
      @if (state() === 'success') {
        <app-card-list [cards]="visible()" />
      }
    </main>
  `,
  styles: [
    `
      .page { max-width: 72rem; margin-inline: auto; padding: var(--space-6) clamp(1rem, 4vw, 2rem); display: grid; gap: var(--space-4); }
      h1 { margin: 0; font-size: clamp(1.5rem, 3vw, 2rem); }
      .error { color: var(--danger); }
    `,
  ],
})
export class CardsPageComponent {
  private readonly repository = inject(CardRepository);

  protected readonly text = signal('');
  protected readonly status = signal<StatusFilter>('ALL');
  protected readonly cards = signal<Card[]>([]);
  protected readonly state = signal<LoadState>('loading');

  protected readonly visible = computed(() =>
    filterCards(this.cards(), { text: this.text(), status: this.status() }),
  );

  constructor() {
    this.repository.list().subscribe({
      next: (cards) => {
        this.cards.set(cards);
        this.state.set('success');
      },
      error: () => this.state.set('error'),
    });
  }
}
