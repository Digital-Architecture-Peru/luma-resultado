import type { NotificationDto, NotificationsApi } from "./types";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

const defaultFetch: FetchFn = (input, init) => fetch(input, init);

export function createNotificationsClient(
  baseUrl: string,
  customerId: string,
  fetchFn: FetchFn = defaultFetch,
): NotificationsApi {
  const headers = { "X-Customer-Id": customerId, Accept: "application/json" };

  async function request(path: string, init?: RequestInit): Promise<Response> {
    const response = await fetchFn(`${baseUrl}/api/v1/notifications${path}`, {
      ...init,
      headers: { ...headers, ...init?.headers },
    });
    if (!response.ok) {
      throw new ApiError(response.status, `Error ${response.status} al consultar notificaciones`);
    }
    return response;
  }

  return {
    async list(status, limit = 20) {
      const response = await request(`?status=${status}&limit=${limit}`);
      return (await response.json()) as NotificationDto[];
    },
    async unreadCount() {
      const response = await request("/unread-count");
      const body = (await response.json()) as { count: number };
      return body.count;
    },
    async markRead(id) {
      await request(`/${encodeURIComponent(id)}/read`, { method: "PATCH" });
    },
  };
}
