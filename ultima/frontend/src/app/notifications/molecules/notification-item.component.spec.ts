import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CardNotification } from '../data/notification.model';
import { NotificationItemComponent } from './notification-item.component';

const unread: CardNotification = {
  id: 'n1',
  cardRef: 'K1',
  last4: '4242',
  type: 'TRANSACTION',
  title: 'Compra aprobada',
  message: 'Compra por 45.90',
  status: 'UNREAD',
  createdAt: '2026-01-15T10:00:00Z',
  readAt: null,
};

describe('NotificationItemComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
  });

  function render(n: CardNotification) {
    const fixture = TestBed.createComponent(NotificationItemComponent);
    fixture.componentRef.setInput('notification', n);
    fixture.detectChanges();
    return fixture;
  }

  it('given an unread notification, then shows masked card, title and action button', () => {
    const el: HTMLElement = render(unread).nativeElement;

    expect(el.textContent).toContain('Compra aprobada');
    expect(el.textContent).toContain('****4242');
    expect(el.querySelector('button')?.textContent).toContain('Marcar como leída');
  });

  it('given a read notification, then hides the action button', () => {
    const el: HTMLElement = render({ ...unread, status: 'READ', readAt: '2026-01-16T10:00:00Z' }).nativeElement;

    expect(el.querySelector('button')).toBeNull();
    expect(el.textContent).toContain('Leída');
  });

  it('when the button is clicked, then emits the notification id', () => {
    const fixture = render(unread);
    const emitted: string[] = [];
    fixture.componentInstance.markRead.subscribe((id) => emitted.push(id));

    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();

    expect(emitted).toEqual(['n1']);
  });
});
