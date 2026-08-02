import { IconByName } from "@/components/ui/icons";
import type { FacingMode } from "@/features/students/types/photo";
import { facingModeLabel } from "@/features/students/utils/photo.utils";
import type { RefObject } from "react";
import { Button } from "@/components/ui/Button";

interface CameraSectionProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  cameraOn: boolean;
  facingMode: FacingMode;
  disabled?: boolean;
  onToggleCamera: () => void;
  onFlip: () => void;
  onCapture: () => void;
}

export default function CameraSection({
  videoRef,
  cameraOn,
  facingMode,
  disabled,
  onToggleCamera,
  onFlip,
  onCapture,
}: CameraSectionProps) {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-surface-elevated p-3">
      <div className="text-xs font-medium text-fg-muted">
        Cámara
        {cameraOn && (
          <span className="ml-2 font-normal text-fg-muted">· {facingModeLabel(facingMode)}</span>
        )}
      </div>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <video
          ref={videoRef}
          className="h-full w-full bg-surface-muted object-contain"
          muted
          playsInline
          autoPlay
        />
        <div className="pointer-events-none absolute inset-0">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            disabled={disabled}
            onClick={onToggleCamera}
            aria-label={cameraOn ? "Apagar cámara" : "Encender cámara"}
            title={cameraOn ? "Apagar cámara" : "Encender cámara"}
            className="pointer-events-auto absolute bottom-1 right-1"
          >
            <IconByName name={cameraOn ? "powerOff" : "power"} className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            disabled={!cameraOn || disabled}
            onClick={onFlip}
            aria-label={facingMode === "user" ? "Cambiar a cámara trasera" : "Cambiar a cámara frontal"}
            title={facingMode === "user" ? "Usar trasera" : "Usar frontal"}
            className="pointer-events-auto absolute top-1 right-1"
          >
            <IconByName name="switchcamera" className="w-4 h-4 active:rotate-180 active:transition-transform active:duration-500" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            disabled={!cameraOn || disabled}
            onClick={onCapture}
            className="pointer-events-auto absolute bottom-1 left-1/2 -translate-x-1/2"
          >
            <IconByName name="camera" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
