import type { CardNotification, ListOptions, Page, Preference } from "./types";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly title: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Contrato que consumen los hooks; permite sustituir la implementación en pruebas. */
export interface NotificationsApi {
  listNotifications(cardId: string, options: ListOptions): Promise<Page<CardNotification>>;
  markAsRead(notificationId: string): Promise<CardNotification>;
  getPreferences(cardId: string): Promise<Preference[]>;
  updatePreferences(cardId: string, preferences: Preference[]): Promise<Preference[]>;
}

interface ProblemBody {
  title?: string;
  detail?: string;
}

async function toApiError(response: Response): Promise<ApiError> {
  let problem: ProblemBody = {};
  try {
    problem = (await response.json()) as ProblemBody;
  } catch {
    // Cuerpo vacío o no JSON: se usa un mensaje genérico.
  }
  const title = problem.title ?? "Error";
  return new ApiError(response.status, title, problem.detail ?? `La solicitud falló (${response.status}).`);
}

export function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}

export function createNotificationsClient(
  baseUrl: string,
  customerId: string,
  fetchImpl: typeof fetch = (input, init) => fetch(input, init),
): NotificationsApi {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "X-Customer-Id": customerId,
    };
    if (init.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    const response = await fetchImpl(`${baseUrl}${path}`, { ...init, headers });
    if (!response.ok) {
      throw await toApiError(response);
    }
    return (await response.json()) as T;
  }

  return {
    listNotifications(cardId, { unreadOnly, page, size }) {
      const query = new URLSearchParams({
        unread: String(unreadOnly),
        page: String(page),
        size: String(size),
      });
      return request<Page<CardNotification>>(
        `/cards/${encodeURIComponent(cardId)}/notifications?${query.toString()}`,
      );
    },
    markAsRead(notificationId) {
      return request<CardNotification>(`/notifications/${encodeURIComponent(notificationId)}/read`, {
        method: "PATCH",
      });
    },
    getPreferences(cardId) {
      return request<Preference[]>(`/cards/${encodeURIComponent(cardId)}/notification-preferences`);
    },
    updatePreferences(cardId, preferences) {
      return request<Preference[]>(`/cards/${encodeURIComponent(cardId)}/notification-preferences`, {
        method: "PUT",
        body: JSON.stringify(preferences),
      });
    },
  };
}
