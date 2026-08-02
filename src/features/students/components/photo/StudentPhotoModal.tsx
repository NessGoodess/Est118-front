"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import { useStudentPhotoStatus } from "@/features/students/hooks/photo/useStudentPhotoStatus";
import { useStudentCamera } from "@/features/students/hooks/photo/useStudentCamera";
import { useStudentPhotoUpload } from "@/features/students/hooks/photo/useStudentPhotoUpload";
import {
  buildPhotoDownloadName,
  prefersNativeCamera,
  triggerBlobDownload,
} from "@/features/students/utils/photo.utils";
import type { StudentPhotoModalProps } from "@/features/students/types/photo";
import PhotoStatus from "./PhotoStatus";
import PhotoPreview from "./PhotoPreview";
import CameraSection from "./CameraSection";
import PhotoActions from "./PhotoActions";

export type { PhotoModalStudentRef, StudentPhotoModalProps } from "@/features/students/types/photo";

export default function StudentPhotoModal({
  student,
  isOpen,
  onClose,
  onSaved,
}: StudentPhotoModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const { clearSelection, ...upload } = useStudentPhotoUpload();
  const [useNativeCamera, setUseNativeCamera] = useState(false);

  const { loading, status } = useStudentPhotoStatus(student?.id, isOpen && Boolean(student));
  const camera = useStudentCamera(isOpen && !useNativeCamera);

  useEffect(() => {
    setUseNativeCamera(prefersNativeCamera());
  }, []);

  useEffect(() => {
    if (!isOpen) clearSelection();
  }, [isOpen, clearSelection]);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleCapture = async () => {
    const file = await camera.captureFrame();
    if (file) upload.pickFile(file);
  };

  const openNativeCamera = () => {
    camera.stopCamera();
    nativeCameraInputRef.current?.click();
  };

  const handleDownload = () => {
    if (!upload.previewUrl) return;
    triggerBlobDownload(upload.previewUrl, buildPhotoDownloadName(student?.id));
  };

  const handleSave = async () => {
    if (!student) return;
    const ok = await upload.savePhoto(student.id, () => {
      onSaved?.();
      onClose();
    });
    if (ok) clearSelection();
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

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={upload.handleFileInputChange}
          />
          <input
            ref={nativeCameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={upload.handleFileInputChange}
          />

          <div className="grid grid-cols-2 gap-1 md:gap-4">
            <PhotoStatus
              src={status?.currentPhotoUrl}
              alt={student.name}
              loading={loading}
            />
            <PhotoPreview src={upload.previewUrl} onPickClick={openFilePicker} />
          </div>

          {camera.canUseCamera && !useNativeCamera && (
            <CameraSection
              videoRef={camera.videoRef}
              cameraOn={camera.cameraOn}
              facingMode={camera.facingMode}
              disabled={loading}
              onToggleCamera={() =>
                camera.cameraOn
                  ? camera.stopCamera()
                  : camera.startCamera(camera.facingMode)
              }
              onFlip={camera.flipCamera}
              onCapture={handleCapture}
            />
          )}

          <PhotoActions
            showNativeCamera={useNativeCamera}
            onNativeCamera={openNativeCamera}
            canUseCamera={camera.canUseCamera}
            hasFile={Boolean(upload.selectedFile)}
            saving={upload.saving}
            loading={loading}
            onDownload={handleDownload}
            onSave={handleSave}
          />
        </div>
      )}
    </Modal>
  );
}
