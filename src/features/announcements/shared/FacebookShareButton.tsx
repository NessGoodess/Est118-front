"use client"

import {
  getAnnouncementPublicUrl,
  openFacebookShare,
} from "@/features/announcements/lib/urls"
import { Button } from "@/components/ui/Button"
import { IconByName } from "@/components/ui/icons"

interface FacebookShareButtonProps {
  idOrSlug: string
  title?: string
  className?: string
  variant?: "primary" | "secondary" | "ghost"
  /** `icon` = solo ícono (público discreto); `default` = ícono + etiqueta */
  size?: "default" | "icon"
  label?: string
}

export default function FacebookShareButton({
  idOrSlug,
  title,
  className = "",
  variant = "secondary",
  size = "default",
  label = "Compartir en Facebook",
}: FacebookShareButtonProps) {
  function handleClick() {
    const origin =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || window.location.origin
    const url = getAnnouncementPublicUrl(idOrSlug, origin)
    openFacebookShare(url)
  }

  const aria = title ? `Compartir “${title}” en Facebook` : label

  if (size === "icon") {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleClick}
        aria-label={aria}
        title={aria}
        className={`h-9 w-9 rounded-full border border-border/70 bg-surface-elevated/90 p-0 text-fg-muted shadow-sm backdrop-blur-sm hover:text-[#1877F2] ${className}`}
      >
        <IconByName name="share" className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant={variant}
      onClick={handleClick}
      aria-label={aria}
      leftIcon={<IconByName name="facebook" className="h-4 w-4 shrink-0" />}
      className={className}
    >
      {label}
    </Button>
  )
}
