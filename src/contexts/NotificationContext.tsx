"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getEcho } from "@/lib/config/echo";
import { handleApiError } from "@/lib/config/api";
import type { AppNotification } from "@/lib/types/notification";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/services/notifications.service";

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

function mapBroadcastPayload(raw: Record<string, unknown>): AppNotification {
  const data = (raw.data as Record<string, unknown> | undefined) ?? raw;

  return {
    id: String(raw.id ?? crypto.randomUUID()),
    type: String(data.type ?? raw.type ?? "unknown"),
    title: String(data.title ?? ""),
    message: String(data.message ?? ""),
    action_url: data.action_url ? String(data.action_url) : null,
    entity_type: data.entity_type ? String(data.entity_type) : null,
    entity_id: typeof data.entity_id === "number" ? data.entity_id : null,
    meta: (data.meta as Record<string, unknown>) ?? {},
    read_at: raw.read_at ? String(raw.read_at) : null,
    created_at: String(raw.created_at ?? data.created_at ?? new Date().toISOString()),
  };
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, authenticated, hasPermission } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const canReceive = authenticated && hasPermission("view pre-enrollments");
  const subscribedRef = useRef(false);

  const refresh = useCallback(async () => {
    if (!canReceive) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      setLoading(true);
      const [list, count] = await Promise.all([fetchNotifications(), fetchUnreadCount()]);
      setNotifications(list.data);
      setUnreadCount(count);
    } catch (err) {
      console.error("Error cargando notificaciones:", handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, [canReceive]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!canReceive || !user?.id) return;

    const echo = getEcho();
    if (!echo || subscribedRef.current) return;

    const channelName = `App.Models.User.${user.id}`;
    const channel = echo.private(channelName);

    const onNotification = (payload: Record<string, unknown>) => {
      const incoming = mapBroadcastPayload(payload);
      setNotifications((prev) => {
        if (prev.some((n) => n.id === incoming.id)) return prev;
        return [incoming, ...prev].slice(0, 30);
      });
      setUnreadCount((c) => c + 1);
    };

    channel.notification(onNotification);
    subscribedRef.current = true;

    return () => {
      echo.leave(channelName);
      subscribedRef.current = false;
    };
  }, [canReceive, user?.id]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const updated = await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...updated, read_at: updated.read_at } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(handleApiError(err).message);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error(handleApiError(err).message);
    }
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      refresh,
      markAsRead,
      markAllAsRead,
    }),
    [notifications, unreadCount, loading, refresh, markAsRead, markAllAsRead]
  );

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications debe usarse dentro de NotificationProvider");
  }
  return ctx;
}
