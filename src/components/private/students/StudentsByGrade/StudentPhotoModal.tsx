"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Student } from "@/lib/types/students";
import { getStudentPhotoStatus, uploadStudentPhoto } from "@/lib/services/students.service";
import { useToast } from "@/contexts/ToastContext";
import { handleApiError } from "@/lib/api";
import Image from "next/image";

/** Mínimo para abrir desde lista o desde expediente. */
export type PhotoModalStudentRef = Pick<Student, "id"> & { name: string };

interface Props {
  student: PhotoModalStudentRef | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function StudentPhotoModal({ student, isOpen, onClose, onSaved }: Props) {
  const { showError, showSuccess, showWarning } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    actionLabel: string;
    hasPhoto: boolean;
    currentPhotoUrl: string | null;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const canUseCamera =
    typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }, []);

  useEffect(() => {
    if (!isOpen || !student) return;

    const run = async () => {
      setLoading(true);
      try {
        const res = await getStudentPhotoStatus(student.id);
        setStatus({
          actionLabel: res.data.action_label,
          hasPhoto: res.data.has_photo,
          currentPhotoUrl: res.data.photo_url,
        });
      } catch (err) {
        showError("Error", handleApiError(err).message || "No se pudo cargar estado de foto.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [isOpen, student, showError]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setSelectedFile(null);
      setPreviewUrl(null);
      setCameraOn(false);
    }
  }, [isOpen, stopCamera]);

  const downloadName = useMemo(
    () => `foto_${student?.id ?? "alumno"}_${Date.now()}.jpg`,
    [student?.id]
  );

  const startCamera = async () => {
    if (!canUseCamera) {
      showWarning("Cámara", "Este navegador no expone captura desde cámara. Usa el botón de galería o abre desde el teléfono.");
      return;
    }

    stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;

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
  };

  const captureFromCamera = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) {
      showWarning("Cámara", "Activa primero la cámara.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          showError("Captura", "No se generó imagen desde la cámara.");
          return;
        }

        const file = new File([blob], `webcam_${Date.now()}.jpg`, { type: "image/jpeg" });
        setSelectedFile(file);
        showSuccess("Listo", "Fotograma tomado (revisa la vista previa y guarda cuando quieras).");
      },
      "image/jpeg",
      0.92
    );
  };

  const handleSave = async () => {
    if (!student || !selectedFile) {
      showWarning("Sin foto", "Selecciona, captura o toma foto con la cámara antes de guardar.");
      return;
    }

    setSaving(true);
    try {
      await uploadStudentPhoto(student.id, selectedFile);
      showSuccess("Foto guardada", "Se optimizó y quedó lista para credencial/listados.");
      onSaved?.();
      onClose();
    } catch (err) {
      showError("Error", handleApiError(err).message || "No se pudo guardar la foto.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fotografía del alumno" maxWidth="2xl">
      {!student ? null : (
        <div className="space-y-4">
          <div className="text-sm text-foreground">
            <span className="font-medium">{student.name}</span>
            {" · "}
            {status?.actionLabel ?? "Capturar"}
          </div>

          {loading ? (
            <div className="text-sm text-fg-muted">Cargando estado de fotografía...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-3 space-y-2">
                <div className="text-xs text-fg-muted">Foto actual</div>
                {status?.currentPhotoUrl ? (
                  <Image
                    src={status.currentPhotoUrl}
                    alt={student.name}
                    width={180}
                    height={180}
                    className="rounded-lg object-cover border"
                    unoptimized
                  />
                ) : (
                  <div className="h-44 rounded-lg bg-surface-muted border grid place-items-center text-sm text-fg-muted px-3 text-center">
                    Sin foto registrada
                  </div>
                )}
              </div>

              <div className="rounded-lg border p-3 space-y-2">
                <div className="text-xs text-fg-muted">Vista previa nueva</div>
                {previewUrl ? (
                  <>
                    {/* Vista previa desde blob; Next/Image no aporta aquí */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Vista previa"
                      width={180}
                      height={180}
                      className="rounded-lg object-cover border w-[180px] h-[180px]"
                    />
                  </>
                ) : (
                  <div className="h-44 rounded-lg bg-surface-muted border grid place-items-center text-sm text-fg-muted px-3 text-center">
                    Aún sin nueva foto seleccionada
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border p-3 space-y-2">
            <div className="text-xs font-medium text-fg-muted">Cámara (escritorio / compatible)</div>
            <video
              ref={videoRef}
              className="w-full max-h-56 rounded-lg bg-black object-contain aspect-video border"
              muted
              playsInline
              autoPlay
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" size="sm" disabled={loading} onClick={startCamera}>
                {cameraOn ? "Reactivar cámara" : "Activar cámara"}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!cameraOn || loading}
                variant="ghost"
                onClick={captureFromCamera}
              >
                Tomar fotograma
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={stopCamera} disabled={!cameraOn}>
                Apagar cámara
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-2">
            <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-border text-sm cursor-pointer hover:bg-surface-muted">
              Galería / móvil
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />
            </label>

            <Button
              variant="secondary"
              disabled={!selectedFile}
              onClick={() => {
                if (!previewUrl) return;
                const a = document.createElement("a");
                a.href = previewUrl;
                a.download = downloadName;
                a.click();
              }}
            >
              Guardar en teléfono
            </Button>

            <Button onClick={handleSave} loading={saving} disabled={!selectedFile || loading}>
              Guardar en sistema
            </Button>
          </div>
          {!canUseCamera && (
            <p className="text-xs text-fg-muted">
              Tu navegador no soporta getUserMedia; en móvil el botón de galería puede abrir directamente la cámara trasera.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
