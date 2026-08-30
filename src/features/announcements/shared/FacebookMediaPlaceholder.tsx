"use client"

import { IconByName } from "@/components/ui/icons"

type Props = {
  className?: string
  label?: string
}

/** Card / list placeholder when the announcement media is a Facebook post. */
export default function FacebookMediaPlaceholder({
  className = "",
  label = "Publicación de Facebook",
}: Props) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-[#1877F2]/10 text-[#1877F2] ${className}`}
    >
      <IconByName name="facebook" className="h-12 w-12" aria-hidden />
      <span className="font-sans text-xs font-semibold uppercase tracking-wide">{label}</span>
    </div>
  )
}
