/** Data tile component for profile information. */
export default function ProfileInfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="group rounded-xl border border-border bg-surface-muted/60 p-4 transition-colors hover:bg-surface-muted hover:border-border/80">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">{label}</div>
      <div className="mt-1.5 text-sm font-medium text-foreground break-words leading-snug">{value}</div>
    </div>
  );
}
