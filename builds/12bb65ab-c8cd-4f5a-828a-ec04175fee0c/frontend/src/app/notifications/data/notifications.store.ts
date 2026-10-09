import { computed, signal } from '@angular/core';
import type { NotificationsGateway } from './notifications.api';
import { Channel, LoadState, NotificationItem, NotificationType, Preference } from './models';

/** Estado de la pantalla con signals; sin dependencias de DI para poder probarlo de forma aislada. */
export class NotificationsStore {
  readonly items = signal<NotificationItem[]>([]);
  readonly state = signal<LoadState>('idle');
  readonly unreadOnly = signal(false);
  readonly preferences = signal<Preference[]>([]);
  readonly saving = signal(false);
  readonly message = signal('');
  readonly unreadCount = computed(() => this.items().filter((i) => !i.isRead).length);

  constructor(private readonly gateway: NotificationsGateway) {}

  async load(): Promise<void> {
    this.state.set('loading');
    try {
      const page = await this.gateway.list(this.unreadOnly(), 1);
      this.items.set(page.items);
      this.state.set('success');
    } catch {
      this.state.set('error');
    }
  }

  async setUnreadOnly(value: boolean): Promise<void> {
    this.unreadOnly.set(value);
    await this.load();
  }

  async markRead(id: string): Promise<void> {
    try {
      await this.gateway.markRead(id);
      this.items.update((list) =>
        this.unreadOnly()
          ? list.filter((i) => i.id !== id)
          : list.map((i) => (i.id === id ? { ...i, isRead: true } : i)),
      );
    } catch {
      this.message.set('No se pudo marcar la notificación como leída.');
    }
  }

  async loadPreferences(): Promise<void> {
    try {
      this.preferences.set(await this.gateway.getPreferences());
    } catch {
      this.message.set('No se pudieron cargar las preferencias.');
    }
  }

  togglePreference(type: NotificationType, channel: Channel): void {
    this.preferences.update((list) =>
      list.map((p) => (p.type === type && p.channel === channel ? { ...p, enabled: !p.enabled } : p)),
    );
  }

  async savePreferences(): Promise<void> {
    this.saving.set(true);
    try {
      this.preferences.set(await this.gateway.savePreferences(this.preferences()));
      this.message.set('Preferencias guardadas.');
    } catch {
      this.message.set('No se pudieron guardar las preferencias.');
    } finally {
      this.saving.set(false);
    }
  }
}
