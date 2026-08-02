"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import ProfileSection from "./ProfileSection";

interface StudentPhotoSectionProps {
  alt: string;
  photoUrl: string | null;
  canViewPhoto: boolean;
  canManagePhoto: boolean;
  onOpenLightbox: () => void;
  onOpenPhotoCapture: () => void;
}

/** Only the institutional photo (+ actions). */
export default function StudentPhotoSection({
  alt,
  photoUrl,
  canViewPhoto,
  canManagePhoto,
  onOpenLightbox,
  onOpenPhotoCapture,
}: StudentPhotoSectionProps) {
  const showPhoto = canViewPhoto && Boolean(photoUrl);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [photoUrl]);

  return (
    <ProfileSection
      as="section"
      title="Fotografía"
      actions={
        <>
          {showPhoto ? (
            <Button variant="secondary" size="sm" onClick={onOpenLightbox}>
              Ver
            </Button>
          ) : null}
          {canManagePhoto ? (
            <Button variant="primary" size="sm" onClick={onOpenPhotoCapture}>
              {photoUrl ? "Renovar" : "Capturar"}
            </Button>
          ) : null}
        </>
      }
    >
      {showPhoto ? (
        <button
          type="button"
          onClick={onOpenLightbox}
          className="relative block w-full aspect-square rounded-xl overflow-hidden ring-1 ring-border bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          title="Ver foto en grande"
        >
          {!loaded && (
            <div
              className="absolute inset-0 animate-pulse bg-surface-muted"
              aria-hidden
            />
          )}
          <Image
            src={photoUrl!}
            alt={alt}
            width={320}
            height={320}
            className={`w-full h-full object-cover select-none pointer-events-none transition-opacity duration-500 ease-out ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            priority
            unoptimized
            draggable={false}
            onLoad={() => setLoaded(true)}
          />
        </button>
      ) : (
        <div className="aspect-square rounded-xl bg-surface-muted grid place-items-center text-sm text-fg-muted text-center px-4">
          {!canViewPhoto
            ? "Sin permiso para ver la foto."
            : canManagePhoto
              ? "Sin foto."
              : "Sin foto registrada."}
        </div>
      )}
    </ProfileSection>
  );
}
