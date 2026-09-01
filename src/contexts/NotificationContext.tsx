"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import useSWR from "swr";
import { useAuth } from "@/contexts/AuthContext";
import { getEcho } from "@/lib/realtime";
import { handleApiError } from "@/lib/api";
import type { AppNotification } from "@/lib/types/notification";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/services/notifications.service";
import { randomUuid } from "@/lib/utils/random-uuid";
import { SWR_PREFIX } from "@/lib/swr";

const MAX_FEED_ITEMS = 30;

interface NotificationFeed {
  items: AppNotification[];
  unreadCount: number;
}

const EMPTY_FEED: NotificationFeed = { items: [], unreadCount: 0 };

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const notificationsKey = () => [SWR_PREFIX.notifications] as const;

async function fetchFeed(): Promise<NotificationFeed> {
  const [list, unreadCount] = await Promise.all([
    fetchNotifications(),
    fetchUnreadCount(),
  ]);
  return { items: list.data, unreadCount };
}

function mapBroadcastPayload(raw: Record<string, unknown>): AppNotification {
  const data = (raw.data as Record<string, unknown> | undefined) ?? raw;

  return {
    id: String(raw.id ?? randomUuid()),
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
  const canReceive = authenticated && hasPermission("view pre-enrollments");
  const subscribedRef = useRef(false);

  const { data, isLoading, mutate } = useSWR<NotificationFeed>(
    canReceive ? notificationsKey() : null,
    fetchFeed,
    {
      onError: (err) => {
        console.error("Error cargando notificaciones:", handleApiError(err).message);
      },
    }
  );

  const feed = data ?? EMPTY_FEED;

  /** Applies a local patch to the cached feed without hitting the API. */
  const patchFeed = useCallback(
    (patch: (current: NotificationFeed) => NotificationFeed) =>
      mutate((current) => patch(current ?? EMPTY_FEED), { revalidate: false }),
    [mutate]
  );

  const refresh = useCallback(async () => {
    await mutate();
  }, [mutate]);

  useEffect(() => {
    if (!canReceive || !user?.id) return;

    const echo = getEcho();
    if (!echo || subscribedRef.current) return;

    const channelName = `App.Models.User.${user.id}`;
    const channel = echo.private(channelName);

    const onNotification = (payload: Record<string, unknown>) => {
      const incoming = mapBroadcastPayload(payload);
      void patchFeed((current) => {
        if (current.items.some((n) => n.id === incoming.id)) return current;
        return {
          items: [incoming, ...current.items].slice(0, MAX_FEED_ITEMS),
          unreadCount: current.unreadCount + 1,
        };
      });
    };

    channel.notification(onNotification);
    subscribedRef.current = true;

    return () => {
      echo.leave(channelName);
      subscribedRef.current = false;
    };
  }, [canReceive, user?.id, patchFeed]);

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        const updated = await markNotificationAsRead(id);
        await patchFeed((current) => ({
          items: current.items.map((n) =>
            n.id === id ? { ...n, ...updated, read_at: updated.read_at } : n
          ),
          unreadCount: Math.max(0, current.unreadCount - 1),
        }));
      } catch (err) {
        console.error(handleApiError(err).message);
      }
    },
    [patchFeed]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();
      await patchFeed((current) => ({
        items: current.items.map((n) => ({
          ...n,
          read_at: n.read_at ?? new Date().toISOString(),
        })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.error(handleApiError(err).message);
    }
  }, [patchFeed]);

  const value = useMemo(
    () => ({
      notifications: feed.items,
      unreadCount: feed.unreadCount,
      loading: isLoading,
      refresh,
      markAsRead,
      markAllAsRead,
    }),
    [feed, isLoading, refresh, markAsRead, markAllAsRead]
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
