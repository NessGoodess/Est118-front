"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { PhotoLoadState } from "@/features/students/types/photo";

interface SmartPhotoProps {
  src: string | null | undefined;
  alt: string;
  loading?: boolean;
  emptyLabel?: string;
}

export default function SmartPhoto({
  src,
  alt,
  loading: externalLoading,
  emptyLabel = "Sin foto",
}: SmartPhotoProps) {
  const [photoState, setPhotoState] = useState<PhotoLoadState>("loading");

  useEffect(() => {
    if (externalLoading) {
      setPhotoState("loading");
      return;
    }
    if (!src) {
      setPhotoState("empty");
      return;
    }
    setPhotoState("loading");
    const img = new window.Image();
    img.onload = () => setPhotoState("loaded");
    img.onerror = () => setPhotoState("error");
    img.src = src;
  }, [src, externalLoading]);

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-lg md:border md:border-border bg-surface-muted">
      {photoState === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/avatar-m.svg"
            alt="cargando"
            fill
            className="object-contain opacity-40 animate-pulse"
          />
        </div>
      )}
      {photoState === "loaded" && src && (
        <Image src={src} alt={alt} fill className="rounded-lg object-cover" unoptimized />
      )}
      {(photoState === "empty" || photoState === "error") && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Image
            src="/avatar-m.svg"
            alt={emptyLabel}
            fill
            className="object-contain opacity-50"
          />
          <span className="relative z-10 rounded-full bg-surface-elevated/80 px-2.5 py-1 text-[11px] font-medium text-fg-muted">
            {photoState === "error" ? "Foto no disponible" : emptyLabel}
          </span>
        </div>
      )}
    </div>
  );
}
