import SmartPhoto from "./SmartPhoto";

interface PhotoStatusProps {
  src: string | null | undefined;
  alt: string;
  loading?: boolean;
}

export default function PhotoStatus({ src, alt, loading }: PhotoStatusProps) {
  return (
    <div className="space-y-1 md:space-y-2 rounded-lg border border-border bg-surface-elevated p-0 md:p-3">
      <div className="text-[10px] md:text-xs text-fg-muted px-1 md:px-0">Foto actual</div>
      <SmartPhoto src={src} alt={alt} loading={loading} emptyLabel="Sin foto" />
    </div>
  );
}
