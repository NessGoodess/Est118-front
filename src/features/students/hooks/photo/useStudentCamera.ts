"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { handleApiError } from "@/lib/api";
import type { FacingMode } from "@/features/students/types/photo";
import { captureVideoFrame, oppositeFacingMode } from "@/features/students/utils/photo.utils";

export function useStudentCamera(enabled: boolean) {
  const { showError, showSuccess, showWarning } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [facingMode, setFacingMode] = useState<FacingMode>("user");

  const canUseCamera =
    typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      stopCamera();
      setFacingMode("user");
    }
  }, [enabled, stopCamera]);

  const startCamera = useCallback(
    async (mode: FacingMode = facingMode) => {
      if (!canUseCamera) {
        showWarning(
          "Cámara",
          "Este navegador no expone captura desde cámara. Elige una foto tocando la vista previa."
        );
        return;
      }

      stopCamera();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        streamRef.current = stream;
        setFacingMode(mode);

        const el = videoRef.current;
        if (el) {
          el.srcObject = stream;
          await el.play();
        }
        setCameraOn(true);
      } catch (err) {
        showError(
          "Cámara",
          handleApiError(err).message || "Permiso denegado o sin cámara disponible."
        );
      }
    },
    [canUseCamera, facingMode, showError, showWarning, stopCamera]
  );

  const flipCamera = useCallback(async () => {
    await startCamera(oppositeFacingMode(facingMode));
  }, [facingMode, startCamera]);

  const captureFrame = useCallback(async (): Promise<File | null> => {
    const video = videoRef.current;
    if (!video?.videoWidth) {
      showWarning("Cámara", "Activa primero la cámara.");
      return null;
    }

    const file = await captureVideoFrame(video);
    if (!file) {
      showError("Captura", "No se generó imagen desde la cámara.");
      return null;
    }

    showSuccess("Listo", "Fotograma tomado (revisa la vista previa y guarda cuando quieras).");
    return file;
  }, [showError, showSuccess, showWarning]);

  return {
    videoRef,
    cameraOn,
    facingMode,
    canUseCamera,
    startCamera,
    flipCamera,
    stopCamera,
    captureFrame,
  };
}
