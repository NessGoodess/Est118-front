declare global {
  interface Window {
    FB?: { XFBML: { parse: (el?: Element | null) => void } }
    fbAsyncInit?: () => void
  }
}

const SCRIPT_ID = "facebook-jssdk"

/** Loads Meta JS SDK once and parses XFBML in optional root. */
export function ensureFacebookSdk(appId: string, onReady?: () => void): void {
  const run = () => {
    onReady?.()
  }

  if (window.FB) {
    run()
    return
  }

  const prev = window.fbAsyncInit
  window.fbAsyncInit = function fbAsyncInit() {
    prev?.()
    run()
  }

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.async = true
    script.defer = true
    script.crossOrigin = "anonymous"
    script.src = `https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v21.0&appId=${appId}`
    document.body.appendChild(script)
  }
}

export function parseFacebookXfbml(root?: Element | null): void {
  window.FB?.XFBML.parse(root ?? undefined)
}

export function getFacebookAppId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim()
  return id || undefined
}

/** Loose check: public Facebook / fb.watch post URLs. */
export function isFacebookPostUrl(value: string): boolean {
  try {
    const u = new URL(value.trim())
    const host = u.hostname.replace(/^www\./, "").toLowerCase()
    return (
      host === "facebook.com" ||
      host.endsWith(".facebook.com") ||
      host === "fb.watch" ||
      host === "fb.com" ||
      host.endsWith(".fb.com")
    )
  } catch {
    return false
  }
}
