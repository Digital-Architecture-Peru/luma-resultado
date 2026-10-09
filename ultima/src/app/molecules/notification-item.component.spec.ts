import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NotificationItemComponent } from './notification-item.component';
import { makeNotification } from '../testing/factories';
import { AccountNotification } from '../domain/notification.model';

function render(notification: AccountNotification) {
  TestBed.configureTestingModule({ imports: [NotificationItemComponent] });
  const fixture = TestBed.createComponent(NotificationItemComponent);
  fixture.componentInstance.notification = notification;
  fixture.detectChanges();
  const root = fixture.nativeElement as HTMLElement;
  return { fixture, root };
}

function buttonByText(root: HTMLElement, text: string): HTMLButtonElement | undefined {
  return Array.from(root.querySelectorAll('button')).find((b) => b.textContent?.trim() === text);
}

describe('NotificationItemComponent', () => {
  it('given an unread notification, when rendered, then shows title, kind label and mark-read button', () => {
    const { root } = render(makeNotification({ title: 'Saldo bajo X', kind: 'low-balance' }));
    expect(root.textContent).toContain('Saldo bajo X');
    expect(root.querySelector('.badge')?.textContent).toContain('Saldo bajo');
    expect(buttonByText(root, 'Marcar como leída')).toBeDefined();
  });

  it('given a read notification, when rendered, then there is no mark-read button', () => {
    const { root } = render(makeNotification({ read: true }));
    expect(buttonByText(root, 'Marcar como leída')).toBeUndefined();
  });

  it('given an unread notification, when mark-read is clicked, then emits its id', () => {
    const { fixture, root } = render(makeNotification({ id: 'n-42' }));
    const emitted: string[] = [];
    fixture.componentInstance.markRead.subscribe((id) => emitted.push(id));
    buttonByText(root, 'Marcar como leída')?.click();
    expect(emitted).toEqual(['n-42']);
  });

  it('given a notification, when dismiss is clicked, then emits its id', () => {
    const { fixture, root } = render(makeNotification({ id: 'n-7' }));
    const emitted: string[] = [];
    fixture.componentInstance.dismiss.subscribe((id) => emitted.push(id));
    buttonByText(root, 'Descartar')?.click();
    expect(emitted).toEqual(['n-7']);
  });
});
