"use client";

import { useCallback, useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  imageUrl: string | null;
  alt: string;
  onClose: () => void;
}

/**
 * Full-screen photo view for student recognition.
 */
export default function StudentPhotoLightbox({ isOpen, imageUrl, alt, onClose }: Props) {
  const [visible, setVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) {
      setVisible(false);
      setImageLoaded(false);
      return;
    }

    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const id = requestAnimationFrame(() => setVisible(true));

    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onKeyDown]);

  useEffect(() => {
    setImageLoaded(false);
  }, [imageUrl, isOpen]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
        visible ? "bg-black/90" : "bg-black/0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Foto ampliada del estudiante"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className={`absolute top-4 right-4 z-10 rounded-full bg-surface-elevated/10 px-4 py-2 text-sm font-medium text-white hover:bg-surface-elevated/20 border border-white/20 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        Cerrar (Esc)
      </button>

      <div
        className="relative flex max-h-[min(92vh,1200px)] max-w-full items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {!imageLoaded && (
          <div
            className="absolute inset-0 m-auto h-48 w-48 max-w-[70vw] rounded-lg bg-white/10 animate-pulse"
            aria-hidden
          />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={alt}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onLoad={() => setImageLoaded(true)}
          className={`max-h-[min(92vh,1200px)] max-w-full object-contain rounded-lg shadow-2xl ring-1 ring-white/20 select-none transition-opacity duration-500 ease-out ${
            imageLoaded && visible ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <p
        className={`mt-3 text-center text-xs text-white/70 max-w-lg transition-opacity duration-300 ${
          visible && imageLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        Imagen en resolución máxima disponible. Haz clic fuera o pulsa Esc para volver.
      </p>
    </div>
  );
}
