import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNotificationGateway } from '../../adapters/mock-notification.gateway';
import { NotificationGateway } from '../../domain/notification.gateway';
import { NotificationCenterComponent } from './notification-center.component';

describe('NotificationCenterComponent', () => {
  let fixture: ComponentFixture<NotificationCenterComponent>;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotificationCenterComponent],
      providers: [{ provide: NotificationGateway, useClass: MockNotificationGateway }]
    });
    fixture = TestBed.createComponent(NotificationCenterComponent);
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  function buttonByText(text: string): HTMLButtonElement {
    const found = Array.from(el.querySelectorAll('button')).find((b) =>
      (b.textContent ?? '').includes(text)
    );
    if (!found) throw new Error(`Button not found: ${text}`);
    return found;
  }

  it('given the mock gateway when loaded then lists notifications and unread summary', () => {
    expect(el.querySelectorAll('app-notification-item')).toHaveLength(4);
    expect(el.querySelector('[role=status]')?.textContent).toContain('2 notificación');
  });

  it('given unread filter when clicked then only unread items are shown', () => {
    buttonByText('No leídas').click();
    fixture.detectChanges();
    expect(el.querySelectorAll('app-notification-item')).toHaveLength(2);
  });

  it('given unread items when mark all clicked then status announces none unread', () => {
    buttonByText('Marcar todas como leídas').click();
    fixture.detectChanges();
    expect(el.querySelector('[role=status]')?.textContent).toContain('No tienes notificaciones sin leer');
    expect(buttonByText('Marcar todas como leídas').disabled).toBe(true);
  });
});
