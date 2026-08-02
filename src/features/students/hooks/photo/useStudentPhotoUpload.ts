"use client";

import { useCallback, useEffect, useState } from "react";
import { uploadStudentPhoto } from "@/features/students/services/students.service";
import { handleApiError } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";

export function useStudentPhotoUpload() {
  const { showError, showSuccess, showWarning } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
  }, []);

  const pickFile = useCallback((file: File | null) => {
    setSelectedFile(file);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
    e.target.value = "";
  }, []);

  const savePhoto = useCallback(
    async (studentId: number, onSuccess?: () => void) => {
      if (!selectedFile) {
        showWarning("Sin foto", "Selecciona o captura una foto antes de guardar.");
        return false;
      }

      setSaving(true);
      try {
        await uploadStudentPhoto(studentId, selectedFile);
        showSuccess("Foto guardada", "Se optimizó y quedó lista para credencial/listados.");
        onSuccess?.();
        return true;
      } catch (err) {
        showError("Error", handleApiError(err).message || "No se pudo guardar la foto.");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [selectedFile, showError, showSuccess, showWarning]
  );

  return {
    selectedFile,
    previewUrl,
    saving,
    pickFile,
    clearSelection,
    handleFileInputChange,
    savePhoto,
  };
}
