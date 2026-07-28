"use client";

import { useCallback, useEffect } from "react";

interface Props {
  isOpen: boolean;
  imageUrl: string | null;
  alt: string;
  onClose: () => void;
}

/**
 * Vista de foto a pantalla completa para reconocimiento del alumno.
 */
export default function StudentPhotoLightbox({ isOpen, imageUrl, alt, onClose }: Props) {
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onKeyDown]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Foto ampliada del estudiante"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-surface-elevated/10 px-4 py-2 text-sm font-medium text-white hover:bg-surface-elevated/20 border border-white/20"
      >
        Cerrar (Esc)
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={alt}
        className="max-h-[min(92vh,1200px)] max-w-full object-contain rounded-lg shadow-2xl ring-1 ring-white/20"
        onClick={(e) => e.stopPropagation()}
      />
      <p className="mt-3 text-center text-xs text-white/70 max-w-lg">
        Imagen en resolución máxima disponible. Haz clic fuera o pulsa Esc para volver.
      </p>
    </div>
  );
}
