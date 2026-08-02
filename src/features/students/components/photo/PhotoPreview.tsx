import SmartPhoto from "./SmartPhoto";

interface PhotoPreviewProps {
  src: string | null | undefined;
  onPickClick: () => void;
}

export default function PhotoPreview({ src, onPickClick }: PhotoPreviewProps) {
  return (
    <button
      type="button"
      onClick={onPickClick}
      className="space-y-1 md:space-y-2 rounded-lg border border-border bg-surface-elevated p-0  md:p-3 text-left transition-colors hover:border-primary/50 hover:bg-surface-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Elegir foto desde archivos"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] md:text-xs text-fg-muted px-1 md:px-0">Vista previa nueva</span>
      </div>
      <SmartPhoto src={src} alt="Vista previa" emptyLabel="Clic para elegir foto" />
    </button>
  );
}
