import apiClient, { API_ENDPOINTS } from "@/lib/api";
import type {
  AppNotification,
  NotificationsListResponse,
  UnreadCountResponse,
} from "@/lib/types/notification";

export async function fetchNotifications(params?: {
  page?: number;
  per_page?: number;
  unread_only?: boolean;
}): Promise<NotificationsListResponse> {
  const res = await apiClient.get<NotificationsListResponse>(API_ENDPOINTS.NOTIFICATIONS.LIST, {
    params,
  });
  return res.data;
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await apiClient.get<UnreadCountResponse>(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  return res.data.data.unread_count;
}

export async function markNotificationAsRead(id: string): Promise<AppNotification> {
  const res = await apiClient.patch<{ success: boolean; data: AppNotification }>(
    API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
  );
  return res.data.data;
}

export async function markAllNotificationsAsRead(): Promise<number> {
  const res = await apiClient.post<UnreadCountResponse>(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
  return res.data.data.unread_count;
}
