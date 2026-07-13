export type AppNotificationType = 'pre_enrollment.created' | string;

export interface AppNotification {
  id: string;
  type: AppNotificationType;
  title: string;
  message: string;
  action_url: string | null;
  entity_type: string | null;
  entity_id: number | null;
  meta: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

export interface NotificationsListResponse {
  success: boolean;
  data: AppNotification[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    unread_count: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: { unread_count: number };
}
