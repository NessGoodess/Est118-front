import { getAnnouncementPublicPath } from "@/features/announcements/lib/urls";
import type { AnnouncementRawItem } from "@/features/announcements/services/announcements.service";
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
  const { searchText: _searchText, ...result } = item;
  return result;
}

export function getPublicSearchTypeLabel(type: PublicSearchResult["type"]): string {
  return TYPE_LABELS[type];
}

export function searchPublicContent(
  query: string,
  announcements: AnnouncementRawItem[] = [],
  limit = 12
): PublicSearchResult[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const staticItems = buildStaticPublicSearchIndex();
  const announcementItems = announcements.map(announcementToItem);
  const allItems = [...staticItems, ...announcementItems];

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
