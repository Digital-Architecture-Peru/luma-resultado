import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentNotification } from '../../domain/notification.model';
import { NotificationItemComponent } from './notification-item.component';

const UNREAD: PaymentNotification = {
  id: 'x1',
  kind: 'payment-failed',
  title: 'Pago rechazado',
  message: 'Detalle',
  amountCents: 12000,
  currency: 'PEN',
  createdAt: '2026-10-09T09:00:00-05:00',
  read: false
};

describe('NotificationItemComponent', () => {
  let fixture: ComponentFixture<NotificationItemComponent>;

  function render(n: PaymentNotification): HTMLElement {
    fixture = TestBed.createComponent(NotificationItemComponent);
    fixture.componentRef.setInput('notification', n);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [NotificationItemComponent] });
  });

  it('given an unread notification when rendered then shows title, badge and action', () => {
    const el = render(UNREAD);
    expect(el.textContent).toContain('Pago rechazado');
    expect(el.querySelector('.badge--error')?.textContent).toContain('Fallido');
    expect(el.querySelector('button')?.textContent).toContain('Marcar como leída');
  });

  it('given an unread notification when action clicked then emits its id', () => {
    const el = render(UNREAD);
    const emitted: string[] = [];
    fixture.componentInstance.markRead.subscribe((id) => emitted.push(id));
    el.querySelector('button')?.click();
    expect(emitted).toEqual(['x1']);
  });

  it('given a read notification when rendered then has no action button', () => {
    const el = render({ ...UNREAD, read: true });
    expect(el.querySelector('button')).toBeNull();
    expect(el.textContent).toContain('Leída');
  });
});
