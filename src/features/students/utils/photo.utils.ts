import type { FacingMode } from "@/features/students/types/photo";

export function buildPhotoDownloadName(studentId: number | string | undefined): string {
  return `foto_${studentId ?? "alumno"}_${Date.now()}.jpg`;
}

export function triggerBlobDownload(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

export function facingModeLabel(mode: FacingMode): string {
  return mode === "user" ? "frontal" : "trasera";
}

export function oppositeFacingMode(mode: FacingMode): FacingMode {
  return mode === "user" ? "environment" : "user";
}

export function prefersNativeCamera(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

/** Captura un fotograma del video a File JPEG. */
export async function captureVideoFrame(
  video: HTMLVideoElement,
  filenamePrefix = "webcam"
): Promise<File | null> {
  if (!video.videoWidth) return null;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        resolve(new File([blob], `${filenamePrefix}_${Date.now()}.jpg`, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92
    );
  });
}
