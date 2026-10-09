import type { Card, CardNotification, NotificationPage, NotificationStatus, Preference } from '../types/notification';

export interface NotificationsApi {
  listCards(): Promise<Card[]>;
  listNotifications(cardId: string, status: NotificationStatus | undefined, page: number, size: number): Promise<NotificationPage>;
  markRead(notificationId: string): Promise<CardNotification>;
  getPreferences(cardId: string): Promise<Preference[]>;
  updatePreferences(cardId: string, preferences: Preference[]): Promise<Preference[]>;
}

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiOptions {
  baseUrl?: string;
  customerId: string;
  fetchFn?: typeof fetch;
}

interface ProblemDetail {
  title?: string;
  detail?: string;
}

interface PreferencesEnvelope {
  preferences: Preference[];
}

export function createNotificationsApi(options: ApiOptions): NotificationsApi {
  const baseUrl = options.baseUrl ?? '';
  const doFetch: typeof fetch = options.fetchFn ?? ((input, init) => fetch(input, init));

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await doFetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-Customer-Id': options.customerId,
      },
    });
    if (!response.ok) {
      throw new ApiError(await readProblem(response), response.status);
    }
    return (await response.json()) as T;
  }

  return {
    listCards: () => request<Card[]>('/api/v1/cards'),

    listNotifications(cardId, status, page, size) {
      const params = new URLSearchParams({ page: String(page), size: String(size) });
      if (status) {
        params.set('status', status);
      }
      return request<NotificationPage>(`/api/v1/cards/${encodeURIComponent(cardId)}/notifications?${params.toString()}`);
    },

    markRead: (id) => request<CardNotification>(`/api/v1/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' }),

    async getPreferences(cardId) {
      const body = await request<PreferencesEnvelope>(`/api/v1/cards/${encodeURIComponent(cardId)}/notification-preferences`);
      return body.preferences;
    },

    async updatePreferences(cardId, preferences) {
      const body = await request<PreferencesEnvelope>(`/api/v1/cards/${encodeURIComponent(cardId)}/notification-preferences`, {
        method: 'PUT',
        body: JSON.stringify({ preferences }),
      });
      return body.preferences;
    },
  };
}

async function readProblem(response: Response): Promise<string> {
  try {
    const problem = (await response.json()) as ProblemDetail;
    return problem.detail ?? problem.title ?? `Error ${response.status}`;
  } catch {
    return `Error ${response.status}`;
  }
}

export function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : 'Error inesperado';
}
