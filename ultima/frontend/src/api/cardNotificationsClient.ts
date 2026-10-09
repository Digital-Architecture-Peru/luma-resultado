import type { NotificationFilter, NotificationPage, Preference } from './types';

export interface CardNotificationsApi {
  list(filter: NotificationFilter, page?: number, size?: number): Promise<NotificationPage>;
  markRead(id: string): Promise<void>;
  markAllRead(): Promise<number>;
  getPreferences(): Promise<Preference[]>;
  savePreferences(preferences: Preference[]): Promise<Preference[]>;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

const defaultFetch: FetchFn = (input, init) => fetch(input, init);

async function errorFrom(response: Response): Promise<ApiError> {
  try {
    const problem = (await response.json()) as { detail?: string; title?: string };
    return new ApiError(response.status, problem.detail ?? problem.title ?? 'Error inesperado');
  } catch {
    return new ApiError(response.status, `Error ${response.status}`);
  }
}

export function createCardNotificationsClient(
  fetchFn: FetchFn = defaultFetch,
  baseUrl = '/api/v1/cards',
): CardNotificationsApi {
  async function request(path: string, init?: RequestInit): Promise<Response> {
    const response = await fetchFn(`${baseUrl}${path}`, {
      ...init,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw await errorFrom(response);
    return response;
  }

  return {
    async list(filter, page = 1, size = 20) {
      const query = new URLSearchParams({ status: filter, page: String(page), size: String(size) });
      const response = await request(`/notifications?${query.toString()}`);
      return (await response.json()) as NotificationPage;
    },
    async markRead(id) {
      await request(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' });
    },
    async markAllRead() {
      const response = await request('/notifications/read-all', { method: 'POST' });
      const body = (await response.json()) as { updated: number };
      return body.updated;
    },
    async getPreferences() {
      const response = await request('/notification-preferences');
      return (await response.json()) as Preference[];
    },
    async savePreferences(preferences) {
      const response = await request('/notification-preferences', {
        method: 'PUT',
        body: JSON.stringify({ preferences }),
      });
      return (await response.json()) as Preference[];
    },
  };
}
