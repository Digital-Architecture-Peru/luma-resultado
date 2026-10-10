import { Component, OnInit, inject, signal } from '@angular/core';
import { NotificationService } from '../../../core/notification.service';
import { AccountNotification, NotificationPreference } from '../../../core/models';
import { AccountLayoutComponent } from '../../templates/account-layout/account-layout.component';
import { NotificationListComponent } from '../../organisms/notification-list/notification-list.component';
import { PreferencesFormComponent } from '../../organisms/preferences-form/preferences-form.component';

const PAGE_SIZE = 5;
// Cuentas ficticias de demostración. Autenticación y propiedad de la cuenta: fuera de alcance (ver README).
const DEMO_ACCOUNTS = ['ACC-001', 'ACC-002'];

/** Página: orquesta datos y estados (carga, error, confirmación). */
@Component({
  selector: 'app-notifications-page',
  imports: [AccountLayoutComponent, NotificationListComponent, PreferencesFormComponent],
  template: `
    <app-account-layout title="Notificaciones de cuenta" subtitle="Banca por Internet">
      <div class="toolbar">
        <label for="account">Cuenta
          <select id="account" (change)="onAccountChange($event)">
            @for (a of accounts; track a) {
              <option [value]="a" [selected]="a === accountId()">{{ a }}</option>
            }
          </select>
        </label>
        <label for="unread">
          <input id="unread" type="checkbox" [checked]="unreadOnly()" (change)="onUnreadChange($event)" />
          Solo no leídas
        </label>
      </div>

      <p role="status" class="status">{{ status() }}</p>
      @if (error(); as message) {
        <p role="alert" class="error">{{ message }}</p>
      }
      @if (loading()) {
        <p class="muted">Cargando…</p>
      }

      <app-notification-list
        [items]="items()"
        [page]="page()"
        [size]="pageSize"
        [total]="total()"
        (markRead)="onMarkRead($event)"
        (pageChange)="onPageChange($event)"
      />

      @if (preferences().length > 0) {
        <app-preferences-form
          [preferences]="preferences()"
          [saving]="saving()"
          (save)="onSavePreferences($event)"
        />
      }
    </app-account-layout>
  `,
})
export class NotificationsPageComponent implements OnInit {
  private readonly api = inject(NotificationService);

  protected readonly accounts = DEMO_ACCOUNTS;
  protected readonly pageSize = PAGE_SIZE;

  protected readonly accountId = signal(DEMO_ACCOUNTS[0] ?? '');
  protected readonly unreadOnly = signal(false);
  protected readonly page = signal(0);
  protected readonly items = signal<AccountNotification[]>([]);
  protected readonly total = signal(0);
  protected readonly preferences = signal<NotificationPreference[]>([]);
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly status = signal('');

  ngOnInit(): void {
    this.loadAll();
  }

  protected onAccountChange(event: Event): void {
    this.accountId.set((event.target as HTMLSelectElement).value);
    this.page.set(0);
    this.loadAll();
  }

  protected onUnreadChange(event: Event): void {
    this.unreadOnly.set((event.target as HTMLInputElement).checked);
    this.page.set(0);
    this.loadNotifications();
  }

  protected onPageChange(page: number): void {
    this.page.set(page);
    this.loadNotifications();
  }

  protected onMarkRead(id: string): void {
    this.api.markRead(id).subscribe({
      next: () => {
        this.status.set('Notificación marcada como leída.');
        this.loadNotifications();
      },
      error: () => {
        this.error.set('No se pudo marcar la notificación como leída.');
        this.loadNotifications();
      },
    });
  }

  protected onSavePreferences(preferences: NotificationPreference[]): void {
    this.saving.set(true);
    this.api.savePreferences(this.accountId(), preferences).subscribe({
      next: (saved) => {
        this.preferences.set(saved);
        this.saving.set(false);
        this.error.set(null);
        this.status.set('Preferencias guardadas.');
      },
      error: () => {
        this.saving.set(false);
        this.error.set('No se pudieron guardar las preferencias. Revisa los valores.');
      },
    });
  }

  private loadAll(): void {
    this.loadNotifications();
    this.api.getPreferences(this.accountId()).subscribe({
      next: (prefs) => this.preferences.set(prefs),
      error: () => this.preferences.set([]),
    });
  }

  private loadNotifications(): void {
    this.loading.set(true);
    this.api
      .list(this.accountId(), { unreadOnly: this.unreadOnly(), page: this.page(), size: PAGE_SIZE })
      .subscribe({
        next: (result) => {
          this.items.set(result.items);
          this.total.set(result.total);
          this.loading.set(false);
        },
        error: () => {
          this.items.set([]);
          this.total.set(0);
          this.loading.set(false);
          this.error.set('No se pudieron cargar las notificaciones.');
        },
      });
  }
}
