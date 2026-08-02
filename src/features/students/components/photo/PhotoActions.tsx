import { Button } from "@/components/ui/Button";

interface PhotoActionsProps {
  canUseCamera: boolean;
  showNativeCamera: boolean;
  onNativeCamera: () => void;
  hasFile: boolean;
  saving: boolean;
  loading?: boolean;
  onDownload: () => void;
  onSave: () => void;
}

export default function PhotoActions({
  showNativeCamera,
  onNativeCamera,
  hasFile,
  saving,
  loading,
  onDownload,
  onSave,
}: PhotoActionsProps) {
  return (
    <div className="flex flex-col flex-wrap justify-end gap-2 sm:flex-row">
      {showNativeCamera && (
        <Button type="button" variant="primary" onClick={onNativeCamera}>
          Tomar foto
        </Button>
      )}

      <Button variant="secondary" disabled={!hasFile} onClick={onDownload}>
        Guardar en este dispositivo
      </Button>

      <Button onClick={onSave} loading={saving} disabled={!hasFile || loading}>
        Guardar
      </Button>
    </div>
  );
}
