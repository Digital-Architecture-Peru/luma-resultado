export type AccountStatus = "ACTIVE" | "BLOCKED" | "CLOSED";

export interface Account {
  id: string;
  maskedNumber: string;
  type: string;
  currency: string;
  /** Decimal en texto para no perder precision. */
  balance: string;
  status: AccountStatus;
  openedAt: string;
}

export type RemoteState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
