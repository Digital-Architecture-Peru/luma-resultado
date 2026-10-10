export type NotificationType = "CREDIT" | "DEBIT" | "LOW_BALANCE";
export type NotificationStatus = "UNREAD" | "READ";
export type Channel = "IN_APP" | "EMAIL" | "SMS" | "PUSH";

export interface AccountNotification {
  id: string;
  accountId: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  createdAt: string;
  readAt: string | null;
}

export interface Preference {
  type: NotificationType;
  channel: Channel;
  enabled: boolean;
  thresholdAmount: number | null;
}

export type RemoteState = "idle" | "loading" | "success" | "error";

export const TYPE_LABELS: Record<NotificationType, string> = {
  CREDIT: "Abonos",
  DEBIT: "Cargos",
  LOW_BALANCE: "Saldo bajo",
};
