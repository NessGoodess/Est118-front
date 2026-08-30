"use client"

import { useEffect, useId } from "react"
import {
  ensureFacebookSdk,
  getFacebookAppId,
  parseFacebookXfbml,
} from "@/features/announcements/lib/facebook-sdk"

interface FacebookPostEmbedProps {
  postUrl: string
}

/**
 * Official Facebook Embedded Post plugin.
 * Requires NEXT_PUBLIC_FACEBOOK_APP_ID and domain allowlisted in the Meta app.
 */
export default function FacebookPostEmbed({ postUrl }: FacebookPostEmbedProps) {
  const appId = getFacebookAppId()
  const mountId = useId().replace(/:/g, "")
  const href = postUrl.trim()

  useEffect(() => {
    if (!appId || !href) return

    function parse() {
      const root = document.getElementById(`fb-post-${mountId}`)
      parseFacebookXfbml(root)
    }

    ensureFacebookSdk(appId, () => {
      requestAnimationFrame(parse)
    })
  }, [appId, href, mountId])

  if (!appId || !href) {
    if (!href) return null
    return (
      <p className="rounded-lg border border-border bg-surface-muted/40 px-4 py-3 text-sm text-fg-muted">
        Hay un post de Facebook vinculado, pero falta configurar{" "}
        <code className="text-xs">NEXT_PUBLIC_FACEBOOK_APP_ID</code> para mostrarlo.
      </p>
    )
  }

  return (
    <div id={`fb-post-${mountId}`} className="my-8 w-full overflow-x-auto">
      <div className="fb-post" data-href={href} data-width="auto" data-show-text="true" />
      <p className="mt-2 text-center font-sans text-xs text-fg-muted">
        Vista previa de Facebook.{" "}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          Abrir publicación
        </a>
      </p>
    </div>
  )
}
