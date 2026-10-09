import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from '../core/account.model';
import { AccountCardComponent } from '../molecules/account-card.component';

export type LoadState = 'loading' | 'success' | 'error';

/** Organismo: lista de cuentas con estados de carga, error y vacío. */
@Component({
  selector: 'app-account-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccountCardComponent],
  template: `
    @switch (state) {
      @case ('loading') {
        <p class="state" role="status">Cargando cuentas…</p>
      }
      @case ('error') {
        <div class="state error" role="alert">
          <p>No pudimos cargar tus cuentas. Intenta nuevamente.</p>
          <button type="button" (click)="retry.emit()">Reintentar</button>
        </div>
      }
      @default {
        @if (accounts.length === 0) {
          <p class="state">No se encontraron cuentas con los filtros indicados.</p>
        } @else {
          <ul class="grid">
            @for (account of accounts; track account.id) {
              <li><app-account-card [account]="account" /></li>
            }
          </ul>
        }
      }
    }
  `,
})
export class AccountListComponent {
  @Input() accounts: readonly Account[] = [];
  @Input() state: LoadState = 'loading';
  @Output() retry = new EventEmitter<void>();
}
