import { getSiteUrl } from "@/lib/site"

export function getAnnouncementPublicPath(idOrSlug: string): string {
  return `/Announcements/${idOrSlug}`
}

export function getAnnouncementPublicUrl(idOrSlug: string, origin?: string): string {
  const base = (origin ?? getSiteUrl()).replace(/\/$/, "")
  return `${base}${getAnnouncementPublicPath(idOrSlug)}`
}

export function facebookShareUrl(pageUrl: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`
}

export function openFacebookShare(pageUrl: string): void {
  const url = facebookShareUrl(pageUrl)
  window.open(url, "_blank", "noopener,noreferrer,width=600,height=520")
}

export function resolvePublicOrigin(fallbackOrigin?: string): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    fallbackOrigin ||
    getSiteUrl()
  )
}
