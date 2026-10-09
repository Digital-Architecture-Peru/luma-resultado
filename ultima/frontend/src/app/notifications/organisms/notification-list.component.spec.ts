import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CardNotification } from '../data/notification.model';
import { NotificationListComponent } from './notification-list.component';

const sample: CardNotification = {
  id: 'n1',
  cardRef: 'K1',
  last4: '4242',
  type: 'PAYMENT_DUE',
  title: 'Pago próximo',
  message: 'Vence en 3 días',
  status: 'UNREAD',
  createdAt: '2026-01-15T10:00:00Z',
  readAt: null,
};

describe('NotificationListComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  function render(inputs: Record<string, unknown>): HTMLElement {
    const fixture = TestBed.createComponent(NotificationListComponent);
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('given loading, then shows a status message', () => {
    expect(render({ loading: true }).querySelector('[role=status]')?.textContent).toContain('Cargando');
  });

  it('given an error, then shows an alert', () => {
    expect(render({ error: 'Falló' }).querySelector('[role=alert]')?.textContent).toContain('Falló');
  });

  it('given no items, then shows the empty state', () => {
    expect(render({ items: [] }).textContent).toContain('No tienes notificaciones');
  });

  it('given items, then renders one entry per notification', () => {
    const el = render({ items: [sample, { ...sample, id: 'n2' }] });

    expect(el.querySelectorAll('app-notification-item').length).toBe(2);
  });
});
