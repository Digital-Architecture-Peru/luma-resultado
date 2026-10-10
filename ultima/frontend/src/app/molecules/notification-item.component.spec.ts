import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentNotification } from '../core/models/payment-notification.model';
import { NotificationItemComponent } from './notification-item.component';

const unread: PaymentNotification = {
  id: 'n-1',
  paymentReference: 'PAY-1',
  type: 'PAGO_EXITOSO',
  status: 'UNREAD',
  title: 'Pago exitoso',
  message: 'Tu pago PAY-1 desde la cuenta ****7890 fue procesado.',
  amount: 125.5,
  currency: 'USD',
  createdAt: '2026-10-09T12:00:00Z',
  readAt: null,
};

describe('NotificationItemComponent', () => {
  let fixture: ComponentFixture<NotificationItemComponent>;

  function render(notification: PaymentNotification): HTMLElement {
    fixture = TestBed.createComponent(NotificationItemComponent);
    fixture.componentRef.setInput('notification', notification);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [NotificationItemComponent] }).compileComponents();
  });

  it('given an unread notification, when rendered, then shows title, masked message, amount and action', () => {
    const el = render(unread);

    expect(el.textContent).toContain('Pago exitoso');
    expect(el.textContent).toContain('****7890');
    expect(el.textContent).toContain('USD 125.50');
    expect(el.textContent).toContain('Sin leer');
    expect(el.querySelector('button')).not.toBeNull();
  });

  it('given an unread notification, when the button is clicked, then emits its id', () => {
    const el = render(unread);
    const emitted: string[] = [];
    fixture.componentInstance.markRead.subscribe((id) => emitted.push(id));

    el.querySelector('button')?.click();

    expect(emitted).toEqual(['n-1']);
  });

  it('given a read notification, when rendered, then hides the action and shows Leída', () => {
    const el = render({ ...unread, status: 'READ', readAt: '2026-10-09T13:00:00Z' });

    expect(el.querySelector('button')).toBeNull();
    expect(el.textContent).toContain('Leída');
  });
});
