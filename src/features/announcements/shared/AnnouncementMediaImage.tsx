"use client"

import Image from "next/image"
import { isTrustedAnnouncementMediaUrl } from "@/features/announcements/lib/media-url"

type FillProps = {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}

/** fill + object-cover layout for cards / featured hero frames. */
export function AnnouncementMediaImageFill({
  src,
  alt,
  className = "object-cover",
  sizes,
  priority,
}: FillProps) {
  if (isTrustedAnnouncementMediaUrl(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- external URLs not in next.config
    <img
      src={src}
      alt={alt}
      className={`absolute inset-0 h-full w-full ${className}`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  )
}

/** List card: blurred fill + sharp contain (no gray letterbox bars). */
export function AnnouncementListCardMediaImage({
  src,
  alt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: FillProps) {
  const fillBase = "absolute inset-0 h-full w-full"
  const backdrop = `${fillBase} object-cover scale-110 blur-sm opacity-55 saturate-125`
  const front =
    `${fillBase} z-[1] object-contain transition-transform duration-500 group-hover:scale-[1.02]`

  if (isTrustedAnnouncementMediaUrl(src)) {
    return (
      <>
        <Image src={src} alt="" fill className={backdrop} sizes={sizes} aria-hidden />
        <Image src={src} alt={alt} fill className={front} sizes={sizes} />
      </>
    )
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- external URLs not in next.config */}
      <img src={src} alt="" aria-hidden className={backdrop} />
      {/* eslint-disable-next-line @next/next/no-img-element -- external URLs not in next.config */}
      <img src={src} alt={alt} className={front} loading="lazy" decoding="async" />
    </>
  )
}

type DetailProps = {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
  width?: number
  height?: number
}

/** Natural aspect in detail hero (object-contain, no crop). */
export function AnnouncementMediaImageDetail({
  src,
  alt,
  className,
  sizes,
  priority,
  width = 1600,
  height = 2000,
}: DetailProps) {
  const detailClass =
    className ??
    "h-auto max-h-[min(70vh,720px)] w-auto max-w-full rounded-2xl object-contain drop-shadow-[0_20px_60px_rgba(13,17,23,0.12)]"

  if (isTrustedAnnouncementMediaUrl(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={detailClass}
        sizes={sizes ?? "(max-width: 1152px) 100vw, 1152px"}
        priority={priority}
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- external URLs not in next.config
    <img
      src={src}
      alt={alt}
      className={detailClass}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  )
}
