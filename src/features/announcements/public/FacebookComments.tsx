"use client"

import { useEffect, useId, useState } from "react"
import { getAnnouncementPublicUrl } from "@/features/announcements/lib/urls"
import {
  ensureFacebookSdk,
  getFacebookAppId,
  parseFacebookXfbml,
} from "@/features/announcements/lib/facebook-sdk"

interface FacebookCommentsProps {
  idOrSlug: string
  numPosts?: number
}

/**
 * Optional Facebook Comments Plugin.
 * Renders only when NEXT_PUBLIC_FACEBOOK_APP_ID is set and the domain
 * is allowlisted in the Meta app settings.
 */
export default function FacebookComments({
  idOrSlug,
  numPosts = 5,
}: FacebookCommentsProps) {
  const appId = getFacebookAppId()
  const mountId = useId().replace(/:/g, "")
  const [href, setHref] = useState<string | null>(null)

  useEffect(() => {
    if (!appId) return

    const pageUrl = getAnnouncementPublicUrl(idOrSlug, window.location.origin)
    setHref(pageUrl)

    function parseComments() {
      const root = document.getElementById(`fb-comments-${mountId}`)
      parseFacebookXfbml(root)
    }

    ensureFacebookSdk(appId, () => {
      requestAnimationFrame(parseComments)
    })
  }, [appId, idOrSlug, mountId])

  if (!appId || !href) return null

  return (
    <div id={`fb-comments-${mountId}`} className="mt-12 border-t border-border pt-10">
      <h2 className="mb-4 font-merriweather text-xl font-bold text-foreground">
        Comentarios
      </h2>
      <div
        className="fb-comments"
        data-href={href}
        data-width="100%"
        data-numposts={String(numPosts)}
        data-order-by="social"
      />
      <p className="mt-3 font-sans text-xs text-fg-muted">
        Los comentarios se gestionan con Facebook. Requieren iniciar sesión en Facebook.
      </p>
    </div>
  )
}
