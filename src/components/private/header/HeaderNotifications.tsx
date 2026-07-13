"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getHeaderIcon } from "./header.icons";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import type { AppNotification } from "@/lib/types/notification";

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

function NotificationItem({
  item,
  onOpen,
}: {
  item: AppNotification;
  onOpen: (item: AppNotification) => void;
}) {
  const unread = !item.read_at;

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={`w-full rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50 ${
        unread ? "bg-blue-50/60" : "bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-900">{item.title}</p>
        {unread && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
      </div>
      <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">{item.message}</p>
      <p className="mt-1 text-[10px] text-slate-400">{formatRelativeTime(item.created_at)}</p>
    </button>
  );
}

export function HeaderNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, refresh } =
    useNotifications();
  const router = useRouter();
  const NotificationIcon = getHeaderIcon("notifications");

  if (!hasPermission("view pre-enrollments")) {
    return null;
  }

  const handleOpen = async (item: AppNotification) => {
    if (!item.read_at) {
      await markAsRead(item.id);
    }
    setIsOpen(false);
    if (item.action_url) {
      router.push(item.action_url);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setIsOpen((v) => !v);
          if (!isOpen) refresh();
        }}
        className="relative rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Notificaciones"
      >
        <NotificationIcon className="mr-2 inline h-4 w-4" />
        Notificaciones
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-lg border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Notificaciones</h3>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  Marcar todas leídas
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {loading ? (
                <p className="py-6 text-center text-sm text-gray-500">Cargando…</p>
              ) : notifications.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-500">
                  No hay notificaciones nuevas
                </p>
              ) : (
                <div className="space-y-1">
                  {notifications.map((item) => (
                    <NotificationItem key={item.id} item={item} onOpen={handleOpen} />
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-gray-100 px-4 py-2 text-center">
              <Link
                href="/admissions/applications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Ver preinscripciones
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
