import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardNotification } from '../../domain/card-notification.model';
import { NotificationGateway } from '../../domain/notification.gateway';
import { NotificationsPageComponent } from './notifications-page.component';

function make(id: string, read: boolean): CardNotification {
  return {
    id,
    cardAlias: 'Visa',
    cardLast4: '1234',
    type: 'PURCHASE',
    severity: 'info',
    title: `Titulo ${id}`,
    message: 'msg',
    createdAt: `2026-10-0${id}T10:00:00Z`,
    read,
  };
}

class FakeGateway extends NotificationGateway {
  constructor(private readonly items: CardNotification[] | null) {
    super();
  }
  override list(): Promise<CardNotification[]> {
    return this.items ? Promise.resolve(this.items) : Promise.reject(new Error('fail'));
  }
}

async function setup(items: CardNotification[] | null): Promise<ComponentFixture<NotificationsPageComponent>> {
  TestBed.configureTestingModule({
    imports: [NotificationsPageComponent],
    providers: [{ provide: NotificationGateway, useValue: new FakeGateway(items) }],
  });
  const fixture = TestBed.createComponent(NotificationsPageComponent);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

describe('NotificationsPageComponent', () => {
  it('given unread items when loaded then announces the unread count', async () => {
    const fixture = await setup([make('1', false), make('2', true)]);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.summary')?.textContent).toContain('Tienes 1 notificaciones sin leer.');
    expect(el.querySelectorAll('app-notification-item').length).toBe(2);
  });

  it('given unread items when pressing "Marcar todas como leídas" then the summary updates', async () => {
    const fixture = await setup([make('1', false), make('2', false)]);
    const el = fixture.nativeElement as HTMLElement;
    const button = Array.from(el.querySelectorAll('button')).find((b) =>
      (b.textContent ?? '').includes('Marcar todas como leídas'),
    ) as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    expect(el.querySelector('.summary')?.textContent).toContain('No tienes notificaciones sin leer.');
  });

  it('given a gateway failure when loaded then shows an error alert', async () => {
    const fixture = await setup(null);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('No pudimos cargar');
  });

  it('given no notifications when loaded then shows the empty state', async () => {
    const fixture = await setup([]);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.empty')?.textContent).toContain('No tienes notificaciones para mostrar.');
  });
});
