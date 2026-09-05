import { NextRequest, NextResponse } from "next/server";
import { getPublicAnnouncements } from "@/features/announcements/services/announcements.service";
import { getPublicGalleries } from "@/features/gallery/api/public";
import { getPublicEvents } from "@/features/events/services/public";
import { searchPublicContent } from "@/lib/public-search/search";

/** Resolves a CMS collection, degrading to an empty list if the API is down. */
async function safeList<T>(load: () => Promise<T[]>): Promise<T[]> {
  try {
    return await load();
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const [announcements, galleries, events] = await Promise.all([
    safeList(getPublicAnnouncements),
    safeList(() => getPublicGalleries()),
    safeList(() => getPublicEvents()),
  ]);

  const published = announcements.filter(
    (item) => item.published_at && new Date(item.published_at) <= new Date()
  );

  const results = searchPublicContent(query, {
    announcements: published,
    galleries,
    events,
  });

  return NextResponse.json({ results });
}
