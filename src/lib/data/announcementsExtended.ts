import type {
  AnnouncementContentBlock,
  AnnouncementContentType,
  AnnouncementExtended,
  AnnouncementMediaType,
} from "@/components/public/sections/Announcements/Announcement-extended.types";
import { getPublicAnnouncements } from "@/lib/services/announcements.service";

/**
 * Announcements en formato extendido (diseño Hero).
 * En producción puede venir de API: GET /api/Announcements, GET /api/Announcements/[id]
 */
export const AnnouncementsExtended: AnnouncementExtended[] = [
  
  {
    id: "3",
    slug: "bot-telegram-notificaciones",
    headerAlert: { enabled: true, label: "Nuevo servicio disponible" },
    header: "Bot de Telegram EST118",
    title: "Recibe notificaciones automáticas cuando tu hijo registre entrada o salida en la escuela.",
    content: {
      type: "list",
      items: ["Notificaciones en tiempo real", "Vinculación con CURP", "Activación en minutos"],
    },
    secondaryButton: { enabled: true, label: "Instrucciones", href: "/instrucciones" },
    media: {
      type: "youtube",
      youtubeId: "fYrk3yMz7Ro",
      alt: "Bot de Telegram EST118",
      ratio: "4/3",
    },
    fecha: "10 de Enero, 2026",
    autor: "Sistemas",
    type: "Informativo",
    importante: false,
    resumen: "Bot de Telegram para notificaciones de entrada y salida.",
    contentBlocks: [
      { type: "paragraph", text: "Puedes recibir notificaciones automáticas cuando tu hijo registre entrada o salida en la escuela, mediante nuestro bot de Telegram. La vinculación es segura y se realiza con CURP." },
      { type: "paragraph", text: "Si deseas ver un tutorial en video, puedes consultar el siguiente enlace o escanear el código QR en recepción." },
      { type: "youtube", youtubeId: "dQw4w9WgXcQ", caption: "Tutorial de activación (ejemplo)" },
    ],
  },
];

/** Obtiene todos los Announcements (en futuro: fetch desde API). */
interface AnnouncementApi {
  id: number;
  slug: string;
  header: string;
  title: string;
  header_alert_enabled: boolean;
  header_alert_label: string | null;
  content_type: AnnouncementContentType;
  content_text: string | null;
  content_items: string[] | null;
  secondary_button_enabled: boolean;
  secondary_button_label: string | null;
  secondary_button_href: string | null;
  media_type: AnnouncementMediaType;
  media_src: string | null;
  media_youtube_id: string | null;
  media_alt: string;
  media_ratio: "4/3" | "3/4" | "4/4";
  published_at: string | null;
  author: string | null;
  type: AnnouncementExtended["type"];
  important: boolean;
  summary: string | null;
  content_blocks: AnnouncementContentBlock[] | null;
}

function formatDateToSpanish(dateString: string | null): string | undefined {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function mapAnnouncementFromApi(api: AnnouncementApi): AnnouncementExtended {
  const content =
    api.content_type === "list"
      ? {
          type: "list" as const,
          items: api.content_items ?? [],
        }
      : {
          type: "text" as const,
          text: api.content_text ?? "",
        };

  return {
    id: String(api.id),
    slug: api.slug,
    headerAlert: api.header_alert_enabled
      ? {
          enabled: true,
          label: api.header_alert_label ?? undefined,
        }
      : undefined,
    header: api.header,
    title: api.title,
    content,
    secondaryButton: {
      enabled: api.secondary_button_enabled,
      label: api.secondary_button_label ?? "",
      href: api.secondary_button_href ?? "",
    },
    media: {
      type: api.media_type,
      src: api.media_src ?? undefined,
      youtubeId: api.media_youtube_id ?? undefined,
      alt: api.media_alt,
      ratio: api.media_ratio,
    },
    fecha: formatDateToSpanish(api.published_at),
    autor: api.author ?? undefined,
    type: api.type,
    importante: api.important,
    resumen: api.summary ?? undefined,
    contentBlocks: api.content_blocks ?? [],
  };
}

export async function getAnnouncementsExtended(): Promise<AnnouncementExtended[]> {
  try {
    const data = await getPublicAnnouncements();
    return data.map(mapAnnouncementFromApi);
  } catch {
    return AnnouncementsExtended;
  }
}

/** Obtiene un Announcement por id o slug (en futuro: fetch desde API). */
export async function getAnnouncementExtendedByIdOrSlug(
  idOrSlug: string
): Promise<AnnouncementExtended | null> {
  const all = await getAnnouncementsExtended();
  const found = all.find(
    (a) => a.id === idOrSlug || a.slug === idOrSlug
  );
  return found ?? null;
}
