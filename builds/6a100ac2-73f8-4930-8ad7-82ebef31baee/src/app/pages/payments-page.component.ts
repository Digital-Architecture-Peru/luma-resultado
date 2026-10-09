import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { EMPTY_FILTER, Payment, PaymentFilter } from '../domain/payment.model';
import { PaymentRepository } from '../domain/payment.repository';
import { filterPayments, formatAmount, sortByDateDesc, totalCompletedByCurrency } from '../domain/payment.queries';
import { PaymentFilterComponent } from '../molecules/payment-filter.component';
import { PaymentTableComponent } from '../organisms/payment-table.component';

type LoadState = 'loading' | 'success' | 'error';

/** Página: orquesta repositorio, filtro y presentación. */
@Component({
  selector: 'app-payments-page',
  imports: [PaymentFilterComponent, PaymentTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Consulta de pagos</h1>

    @switch (state()) {
      @case ('loading') {
        <p role="status" class="info">Cargando pagos…</p>
      }
      @case ('error') {
        <div role="alert" class="error">
          <p>No pudimos cargar tus pagos. Intenta nuevamente.</p>
          <button type="button" (click)="load()">Reintentar</button>
        </div>
      }
      @case ('success') {
        <app-payment-filter [filter]="filter()" (filterChange)="filter.set($event)" />
        <p role="status" class="info">
          {{ visible().length }} de {{ payments().length }} pagos.
          @if (totalLabel()) { Total completado: {{ totalLabel() }}. }
        </p>
        <app-payment-table [payments]="visible()" />
      }
    }
  `,
})
export class PaymentsPageComponent implements OnInit {
  private readonly repository = inject(PaymentRepository);

  protected readonly state = signal<LoadState>('loading');
  protected readonly payments = signal<readonly Payment[]>([]);
  protected readonly filter = signal<PaymentFilter>(EMPTY_FILTER);

  protected readonly visible = computed(() =>
    sortByDateDesc(filterPayments(this.payments(), this.filter())),
  );

  protected readonly totalLabel = computed(() =>
    Object.entries(totalCompletedByCurrency(this.visible()))
      .map(([currency, amount]) => formatAmount(amount, currency))
      .join(' · '),
  );

  ngOnInit(): void {
    void this.load();
  }

  protected async load(): Promise<void> {
    this.state.set('loading');
    try {
      this.payments.set(await this.repository.list());
      this.state.set('success');
    } catch {
      this.state.set('error');
    }
  }
}
