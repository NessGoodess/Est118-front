import { API_CONFIG } from "@/lib/api/env"

const LOCAL_API_HOSTS = new Set(["localhost", "127.0.0.1"])

function apiHostname(): string | null {
  try {
    return new URL(API_CONFIG.API_BASE_URL).hostname.toLowerCase()
  } catch {
    return null
  }
}

/** True when src is served by our API (storage) and safe for next/image. */
export function isTrustedAnnouncementMediaUrl(src: string | undefined | null): boolean {
  const value = src?.trim()
  if (!value) return false

  if (value.startsWith("/storage/")) return true

  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase()
    const trustedHost = apiHostname()

    if (trustedHost && host === trustedHost) return true
    if (LOCAL_API_HOSTS.has(host)) return true
    if (url.pathname.includes("/storage/announcements/")) return true

    return false
  } catch {
    return false
  }
}
