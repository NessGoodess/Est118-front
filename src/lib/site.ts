/**
 * Runtime public site URL (Open Graph, absolute links).
 * Announcement-specific share helpers live in features/announcements/lib/urls.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")
  if (explicit) return explicit

  const vercel = process.env.VERCEL_URL?.replace(/\/$/, "")
  if (vercel) return vercel.startsWith("http") ? vercel : `https://${vercel}`

  return "http://localhost:3000"
}
