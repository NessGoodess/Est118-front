import { getAnnouncementPublicPath } from "@/features/announcements/lib/urls";
import type { AnnouncementRawItem } from "@/features/announcements/services/announcements.service";
import type { GalleryRawItem } from "@/features/gallery/types/gallery";
import type { EventRawItem } from "@/features/events/types/event";
import { normalizeSearchText } from "./normalize";
import { buildStaticPublicSearchIndex } from "./static-index";
import type { PublicSearchItem, PublicSearchResult } from "./types";

const TYPE_LABELS: Record<PublicSearchResult["type"], string> = {
  page: "Página",
  section: "Sección",
  announcement: "Aviso",
  event: "Evento",
  gallery: "Galería",
  admission: "Preinscripción",
  contact: "Contacto",
};

function announcementToItem(announcement: AnnouncementRawItem): PublicSearchItem {
  const slugOrId = announcement.slug?.trim() || String(announcement.id);
  const searchText = [
    announcement.title,
    announcement.type,
    announcement.summary,
    announcement.header,
    announcement.content_text,
    announcement.author,
    announcement.media_alt,
    ...(announcement.content_items ?? []),
  ]
    .filter(Boolean)
    .join(" ");

  return {
    id: `announcement-${announcement.id}`,
    label: announcement.title,
    href: getAnnouncementPublicPath(slugOrId),
    type: "announcement",
    description: announcement.summary ?? announcement.header ?? undefined,
    searchText,
  };
}

function galleryToItem(gallery: GalleryRawItem): PublicSearchItem {
  const slugOrId = gallery.slug?.trim() || String(gallery.id)
  const searchText = [
    gallery.title,
    gallery.category,
    gallery.description,
    "galería álbum fotos",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    id: `gallery-${gallery.id}`,
    label: gallery.title,
    href: `/galeria/${slugOrId}`,
    type: "gallery",
    description:
      gallery.description ??
      `${gallery.items_count ?? 0} fotos · ${gallery.category}`,
    searchText,
  };
}

function eventToItem(event: EventRawItem): PublicSearchItem {
  const slugOrId = event.slug?.trim() || String(event.id)
  const searchText = [
    event.title,
    event.type,
    event.summary,
    event.location,
    "evento calendario actividad",
  ]
    .filter(Boolean)
    .join(" ")

  return {
    id: `event-${event.id}`,
    label: event.title,
    href: `/eventos/${slugOrId}`,
    type: "event",
    description: event.summary ?? `${event.type}${event.location ? ` · ${event.location}` : ""}`,
    searchText,
  }
}

function scoreItem(item: PublicSearchItem, tokens: string[]): number {
  const haystack = normalizeSearchText(item.searchText);
  const label = normalizeSearchText(item.label);
  let score = 0;

  for (const token of tokens) {
    if (!haystack.includes(token)) return -1;
    if (label.includes(token)) score += 4;
    else if (normalizeSearchText(item.description ?? "").includes(token)) score += 2;
    else score += 1;
  }

  if (label.startsWith(tokens[0] ?? "")) score += 2;
  return score;
}

function toResult(item: PublicSearchItem): PublicSearchResult {
  const { searchText, ...result } = item;
  void searchText;
  return result;
}

export function getPublicSearchTypeLabel(type: PublicSearchResult["type"]): string {
  return TYPE_LABELS[type];
}

/** CMS content pulled from the API at request time. */
export interface PublicSearchSources {
  announcements?: AnnouncementRawItem[];
  galleries?: GalleryRawItem[];
  events?: EventRawItem[];
}

export function searchPublicContent(
  query: string,
  sources: PublicSearchSources = {},
  limit = 12
): PublicSearchResult[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const allItems = [
    ...buildStaticPublicSearchIndex(),
    ...(sources.announcements ?? []).map(announcementToItem),
    ...(sources.galleries ?? []).map(galleryToItem),
    ...(sources.events ?? []).map(eventToItem),
  ];

  const ranked = allItems
    .map((item) => ({ item, score: scoreItem(item, tokens) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label, "es"));

  const seen = new Set<string>();
  const results: PublicSearchResult[] = [];

  for (const { item } of ranked) {
    const key = `${item.type}:${item.href}:${item.label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(toResult(item));
    if (results.length >= limit) break;
  }

  return results;
}
