import { NextRequest, NextResponse } from "next/server";
import { getPublicAnnouncements } from "@/features/announcements/services/announcements.service";
import { searchPublicContent } from "@/lib/public-search/search";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const announcements = await getPublicAnnouncements();
    const published = announcements.filter(
      (item) => item.published_at && new Date(item.published_at) <= new Date()
    );
    const results = searchPublicContent(query, published);
    return NextResponse.json({ results });
  } catch {
    const results = searchPublicContent(query, []);
    return NextResponse.json({ results });
  }
}
