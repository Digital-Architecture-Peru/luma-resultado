import { describe, expect, it, vi } from 'vitest';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AccountNotification, NotificationPreference, PageResult } from './models';
import { NotificationService } from './notification.service';

interface FakeHttp {
  get: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
}

const sample: AccountNotification = {
  id: 'n-1',
  accountId: 'ACC-001',
  type: 'DEPOSIT',
  title: 'Depósito recibido',
  body: 'Detalle ficticio',
  amount: 10,
  currency: 'USD',
  createdAt: '2026-10-08T14:30:00Z',
  readAt: null,
};

function build(): { service: NotificationService; http: FakeHttp } {
  const page: PageResult<AccountNotification> = { items: [sample], page: 0, size: 20, total: 1 };
  const http: FakeHttp = {
    get: vi.fn(() => of(page)),
    patch: vi.fn(() => of({ ...sample, readAt: '2026-10-09T00:00:00Z' })),
    put: vi.fn((_url: string, body: NotificationPreference[]) => of(body)),
  };
  return { service: new NotificationService(http as unknown as HttpClient), http };
}

describe('NotificationService', () => {
  it('given filters when list then calls the account endpoint with query params', () => {
    const { service, http } = build();

    service.list('ACC-001', { unreadOnly: true, page: 2, size: 10 }).subscribe();

    const [url, options] = http.get.mock.calls[0] as [string, { params: { get(k: string): string | null } }];
    expect(url).toBe(`${environment.apiBaseUrl}/api/v1/accounts/ACC-001/notifications`);
    expect(options.params.get('unread')).toBe('true');
    expect(options.params.get('page')).toBe('2');
    expect(options.params.get('size')).toBe('10');
  });

  it('given an id when markRead then sends PATCH to the read endpoint', () => {
    const { service, http } = build();
    let readAt: string | null = null;

    service.markRead('n-1').subscribe((n) => (readAt = n.readAt));

    expect(http.patch.mock.calls[0]?.[0]).toBe(`${environment.apiBaseUrl}/api/v1/notifications/n-1/read`);
    expect(readAt).toBe('2026-10-09T00:00:00Z');
  });

  it('given preferences when save then sends PUT with the same body', () => {
    const { service, http } = build();
    const prefs: NotificationPreference[] = [{ type: 'LOW_BALANCE', enabled: true, threshold: 50 }];

    service.savePreferences('ACC-001', prefs).subscribe();

    expect(http.put.mock.calls[0]?.[0]).toBe(
      `${environment.apiBaseUrl}/api/v1/accounts/ACC-001/notification-preferences`,
    );
    expect(http.put.mock.calls[0]?.[1]).toEqual(prefs);
  });

  it('given an account id with special characters when list then it is URL encoded', () => {
    const { service, http } = build();

    service.list('A/B', { unreadOnly: false, page: 0, size: 5 }).subscribe();

    expect(http.get.mock.calls[0]?.[0]).toContain('/accounts/A%2FB/notifications');
  });
});
